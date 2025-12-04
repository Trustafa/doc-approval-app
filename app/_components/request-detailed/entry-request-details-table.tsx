'use client';

import { RequestResponse } from '@/app/api/_services/request.service';
import {
  Link,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
} from '@mui/material';

type ApprovalTableProps = {
  data: RequestResponse & { approvers: string[] };
};

type ApprovalTableRowProps = {
  header: string;
  data: React.ReactNode;
};

function ApprovalTableRow({ header, data }: ApprovalTableRowProps) {
  return (
    <TableRow>
      <TableCell sx={{ fontWeight: 'bold', width: '200px' }}>
        {header}
      </TableCell>
      <TableCell>{data}</TableCell>
    </TableRow>
  );
}

export default function ApprovalDetailsTable({ data }: ApprovalTableProps) {
  return (
    <TableContainer component={Paper} sx={{ borderRadius: 2, mb: 3 }}>
      <Table key={data.id}>
        <TableBody>
          <ApprovalTableRow header="Title" data={data.title} />

          <ApprovalTableRow header="Payee" data={data.payee} />

          <ApprovalTableRow
            header="Description"
            data={data.description || '—'}
          />

          <ApprovalTableRow
            header="Requester"
            data={data.requester?.name ?? '—'}
          />

          <ApprovalTableRow
            header="Approvers"
            data={data.approvers.length ? data.approvers.join(', ') : '—'}
          />

          <ApprovalTableRow
            header="Amount"
            data={`${data.amount.toLocaleString(undefined, {
              minimumFractionDigits: 2,
            })} ${data.currency}`}
          />

          <ApprovalTableRow
            header="Status"
            data={data.status?.toString() ?? '—'}
          />

          <ApprovalTableRow
            header="Created At"
            data={new Date(data.createdAt).toLocaleString()}
          />

          <ApprovalTableRow
            header="Supporting Document"
            data={
              data.approvalFile ? (
                <Link
                  href={`/api/files/${data.approvalFile.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {data.approvalFile.filename}
                </Link>
              ) : (
                'No document'
              )
            }
          />
        </TableBody>
      </Table>
    </TableContainer>
  );
}
