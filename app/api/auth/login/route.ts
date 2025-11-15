import z from 'zod';
import { PrismaClient } from '@/generated/prisma/client';
import { cookies as cookies } from 'next/headers';
import { comparePassword } from '../../_services/auth.service';
import { findUserByEmail } from '../../_services/user.service';
import { createSession } from '../../_services/session.service';

const inputSchema = z.object({
  email: z.string(),
  password: z.string(),
  longLife: z.boolean().optional(),
});

export async function POST(request: Request) {
  const body = await request.json();
  const parsedBody = inputSchema.safeParse(body);

  if (!parsedBody.success) {
    return Response.json({ error: 'Invalid input' }, { status: 400 });
  }

  const input = parsedBody.data;

  const user = await findUserByEmail(input.email);
  const compare =
    user && (await comparePassword(input.password, user.hashedPassword));

  if (!user || !compare) {
    return Response.json(
      { error: 'Invalid username or password' },
      { status: 401 }
    );
  }

  if (user?.disabled) {
    return Response.json(
      { error: 'User account is disabled' },
      { status: 403 }
    );
  }

  const expiresAt = new Date();

  if (input.longLife) {
    expiresAt.setMonth(expiresAt.getMonth() + 1);
  } else {
    expiresAt.setHours(expiresAt.getHours() + 1);
  }

  const session = await createSession({
    userId: user.id,
    expiresAt,
    userAgent: request.headers.get('user-agent') || 'unknown',
    ipAddress: request.headers.get('x-forwarded-for') || 'unknown',
  });

  const cookieStore = await cookies();

  cookieStore.set('session-id', session.id, {
    httpOnly: true,
    expires: expiresAt,
  });

  return new Response(null, { status: 204 });
}
