import { toMeUserResponse } from '../../_services/user.service';
import {
  comparePassword,
  findLoggedInUser,
  hashPassword,
} from '../../_services/auth.service';
import z from 'zod';
import { prisma } from '../../prisma';

export async function GET(): Promise<Response> {
  const user = await findLoggedInUser();
  if (!user) {
    return new Response(null, { status: 401 });
  }

  return Response.json(toMeUserResponse(user));
}

const userUpdateSchema = z.object({
  name: z.string().optional(),
  email: z.email().optional(),
  oldPassword: z.string().optional(),
  newPassword: z.string().optional(),
  signatureFileId: z.string().optional(),
});

export async function POST(req: Request): Promise<Response> {
  const body = await req.json();
  const parsedBody = userUpdateSchema.safeParse(body);

  if (!parsedBody.success) {
    return Response.json({ error: 'Invalid input' }, { status: 400 });
  }

  const user = await findLoggedInUser();
  if (!user) {
    return new Response(null, { status: 401 });
  }

  const { data } = parsedBody;

  await prisma.user.update({
    where: { id: user.id },
    data: {
      name: data.name,
      email: data.email,
      signatureFile: data.signatureFileId
        ? { connect: { id: data.signatureFileId } }
        : undefined,
    },
  });

  const { oldPassword, newPassword } = data;
  if (oldPassword && newPassword) {
    const match = await comparePassword(oldPassword, user.hashedPassword);

    if (!match) {
      return new Response(null, { status: 400 });
    }

    await prisma.user.update({
      where: { id: user.id },
      data: { hashedPassword: await hashPassword(newPassword) },
    });
  }

  return new Response(null, { status: 204 });
}
