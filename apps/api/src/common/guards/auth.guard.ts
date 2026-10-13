import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

/**
 * Mock authentication.
 *
 * Onboarding / signup / session issuance are deliberately out of scope for this
 * demo (we assume every practitioner and member is already registered). The
 * guard simply resolves the current user from an `x-user-id` header — which lets
 * the frontend switch identities with a dropdown while still exercising a real
 * "resolve identity per request, reject unknown principals" path.
 *
 * Swapping this for JWT/session verification later touches exactly one file.
 */
@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly prisma: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const userId = request.headers['x-user-id'] as string | undefined;
    if (!userId) {
      throw new UnauthorizedException(
        'Missing x-user-id header (mock auth — pick a user in the switcher)',
      );
    }
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, handle: true, displayName: true },
    });
    if (!user) {
      throw new UnauthorizedException(`Unknown user: ${userId}`);
    }
    request.user = user;
    return true;
  }
}
