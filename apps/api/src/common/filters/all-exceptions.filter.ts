import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import type { FastifyReply } from 'fastify';

/**
 * Normalizes every error to a single JSON shape:
 *   { statusCode, error, message, path, timestamp }
 * Prisma errors are translated to sensible HTTP codes so DB concerns never
 * leak as 500s.
 */
@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const reply = ctx.getResponse<FastifyReply>();
    const request = ctx.getRequest();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message: string | string[] = 'Internal server error';
    let error = 'Internal Server Error';

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const res = exception.getResponse();
      if (typeof res === 'string') {
        message = res;
      } else if (typeof res === 'object' && res !== null) {
        const r = res as Record<string, unknown>;
        message = (r.message as string | string[]) ?? exception.message;
        error = (r.error as string) ?? exception.name;
      }
    } else if (exception instanceof Prisma.PrismaClientKnownRequestError) {
      if (exception.code === 'P2002') {
        status = HttpStatus.CONFLICT;
        error = 'Conflict';
        message = `Unique constraint failed on ${JSON.stringify(exception.meta?.target)}`;
      } else if (exception.code === 'P2025') {
        status = HttpStatus.NOT_FOUND;
        error = 'Not Found';
        message = 'Record not found';
      }
    }

    if (status >= 500) {
      this.logger.error(exception);
    }

    void reply.status(status).send({
      statusCode: status,
      error,
      message,
      path: request?.url,
      timestamp: new Date().toISOString(),
    });
  }
}
