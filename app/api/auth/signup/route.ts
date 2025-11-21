import z from 'zod';
import { toUserResponse } from '../../_services/user.service';
import { prisma } from '../../prisma';
import { hashPassword } from '../../_services/auth.service';

const createUserSchema = z.object({
  name: z.string().min(1),
  email: z.email(),
  password: z.string(),
});

export async function POST(req: Request): Promise<Response> {
  const body = await req.json();
  const parsedBody = createUserSchema.safeParse(body);

  if (!parsedBody.success) {
    return Response.json({ error: 'Invalid input' }, { status: 400 });
  }

  const input = parsedBody.data;

  const user = await prisma.user.create({
    data: {
      name: input.name,
      email: input.email.toLowerCase(),
      hashedPassword: await hashPassword(input.password),
    },
  });

  return Response.json(toUserResponse(user), { status: 201 });
}
