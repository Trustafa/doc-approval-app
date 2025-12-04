import { findLoggedInUser } from '../_services/auth.service';
import { prisma } from '../prisma';

export async function GET(): Promise<Response> {
  const user = await findLoggedInUser();
  if (!user) {
    return new Response(null, { status: 401 });
  }

  const users = await prisma.user.findMany();

  return Response.json({ data: users }, { status: 200 });
}
