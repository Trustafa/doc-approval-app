'use client';

import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
} from '@mui/material';

type ApprovalTableProps = {
  data: ApprovalEntryData;
  onApprove: (id: number) => void;
  onReject: (id: number) => void;
};

type ApprovalEntryData = {
  id: number;
  requestDate: string;
  payee: string;
  amount: number;
  currency: string;
  requester: string;
  status: string;
  approvers: string[];
};

type ApprovalTableRowProps = {
  header: string;
  data: string | number;
};

function ApprovalTableRow({ header, data }: ApprovalTableRowProps) {
  return (
    <TableRow>
      <TableCell sx={{ fontWeight: 'bold' }}>{header}</TableCell>
      <TableCell>{data}</TableCell>
    </TableRow>
  );
}

export default function ApprovalDetailsTable({
  data,
  onApprove,
  onReject,
}: ApprovalTableProps) {
  return (
    <TableContainer component={Paper}>
      <Table key={data.id} sx={{ mb: 2 }}>
        <TableBody>
          <ApprovalTableRow header="Document Name" data={data.payee} />
          <ApprovalTableRow header="Requester" data={data.requester} />
          <ApprovalTableRow
            header="Approvers"
            data={data.approvers.join(', ')}
          />
          <ApprovalTableRow header="Amount" data={data.amount.toFixed(2)} />
          <ApprovalTableRow header="Status" data={data.status} />
          <ApprovalTableRow
            header="Date"
            data={new Date(data.requestDate).toLocaleDateString()}
          />
        </TableBody>
      </Table>
    </TableContainer>
  );
}
