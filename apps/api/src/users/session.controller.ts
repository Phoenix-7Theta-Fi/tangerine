import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { PrismaService } from '../prisma/prisma.service';

/**
 * Demo-only identity bootstrap. Onboarding and signup are out of scope, so the
 * frontend needs a way to discover the pre-registered users to act as. This is
 * intentionally the only unauthenticated data endpoint; a real deployment would
 * replace it with a proper login flow.
 */
@ApiTags('session')
@Controller('session')
export class SessionController {
  constructor(private readonly prisma: PrismaService) {}

  @Get('identities')
  @ApiOperation({ summary: 'List pre-registered identities for the demo switcher' })
  async identities() {
    return this.prisma.user.findMany({
      orderBy: [{ createdAt: 'asc' }],
      take: 100,
      select: {
        id: true,
        handle: true,
        displayName: true,
        avatarUrl: true,
        role: true,
        headline: true,
        region: true,
        isCelebrity: true,
      },
    });
  }
}
