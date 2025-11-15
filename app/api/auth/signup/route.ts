import z from 'zod';
import { createUser, toUserResponse } from '../../_services/user.service';

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

  const user = await createUser(input);

  return Response.json(toUserResponse(user), { status: 201 });
}
