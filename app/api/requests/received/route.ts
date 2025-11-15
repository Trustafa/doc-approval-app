import { NextRequest } from 'next/server';
import { findRequestsByReceiver } from '../../_services/request.service';
import { findLoggedInUser } from '../../_services/auth.service';

export async function GET(req: NextRequest) {
  const user = await findLoggedInUser();
  if (!user) {
    return new Response(null, { status: 401 });
  }

  const searchParams = req.nextUrl.searchParams;
  const statusQuery = searchParams.get('status');
  const pageQuery = searchParams.get('page') ?? 1;
  const pageSizeQuery = searchParams.get('pageSize') ?? 20;

  const statusIsPending = statusQuery === 'PENDING';

  const skip = (Number(pageQuery) - 1) * Number(pageSizeQuery);
  const [data, total] = await findRequestsByReceiver(user.id, {
    take: Number(pageSizeQuery),
    skip,
    status: statusIsPending ? 'PENDING' : undefined,
  });

  return Response.json({ data, total }, { status: 200 });
}
