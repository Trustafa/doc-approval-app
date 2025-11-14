import {
  toUserResponse,
  updateUser,
  updateUserPassword,
} from '../../_services/user.service';
import {
  comparePassword,
  findLoggedInUser,
} from '../../_services/auth.service';
import z from 'zod';

export async function GET(): Promise<Response> {
  const user = await findLoggedInUser();
  if (!user) {
    return new Response(null, { status: 401 });
  }

  return Response.json(toUserResponse(user));
}

const userUpdateSchema = z.object({
  name: z.string().optional(),
  email: z.email().optional(),
  oldPassword: z.string().optional(),
  newPassword: z.string().optional(),
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

  const { oldPassword, newPassword, ...userDetails } = parsedBody.data;
  await updateUser(user.id, userDetails);

  if (oldPassword && newPassword) {
    const compare = await comparePassword(oldPassword, user.hashedPassword);
    if (compare) await updateUserPassword(user.id, newPassword);
  }

  return new Response(null, { status: 200 });
}
