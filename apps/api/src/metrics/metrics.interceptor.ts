import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, tap } from 'rxjs';
import { MetricsService } from './metrics.service';

interface TimedRequest {
  method?: string;
  url?: string;
  routeOptions?: { url?: string };
}

/**
 * Records one histogram observation per HTTP request. The route label uses the
 * registered route pattern (not the raw URL) so cardinality stays bounded even
 * under high-cardinality ids in the path.
 */
@Injectable()
export class MetricsInterceptor implements NestInterceptor {
  constructor(private readonly metrics: MetricsService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    if (context.getType() !== 'http') return next.handle();
    const request = context.switchToHttp().getRequest<TimedRequest>();
    const response = context.switchToHttp().getResponse<{ statusCode: number }>();
    const method = request.method ?? 'GET';
    const route = request.routeOptions?.url ?? request.url?.split('?')[0] ?? 'unknown';
    const start = process.hrtime.bigint();

    const record = () => {
      const seconds = Number(process.hrtime.bigint() - start) / 1e9;
      const status = String(response.statusCode ?? 0);
      this.metrics.httpRequestDuration.observe(
        { method, route, status },
        seconds,
      );
      this.metrics.httpRequestsTotal.inc({ method, route, status });
    };

    return next.handle().pipe(
      tap({
        next: record,
        error: record,
      }),
    );
  }
}
