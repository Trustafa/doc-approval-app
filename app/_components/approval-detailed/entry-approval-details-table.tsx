import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
} from '@mui/material';

type ApprovalEntry = {
  id: number;
  documentName: string;
  requester: string;
  approvers: string[];
  amount: number;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  date: string;
};

type ApprovalTableProps = {
  data: ApprovalEntry;
  onApprove: (id: number) => void;
  onReject: (id: number) => void;
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
          <ApprovalTableRow header="Document Name" data={data.documentName} />
          <ApprovalTableRow header="Requester" data={data.requester} />
          <ApprovalTableRow
            header="Approvers"
            data={data.approvers.join(', ')}
          />
          <ApprovalTableRow header="Amount" data={data.amount.toFixed(2)} />
          <ApprovalTableRow header="Status" data={data.status} />
          <ApprovalTableRow
            header="Date"
            data={new Date(data.date).toLocaleDateString()}
          />
        </TableBody>
      </Table>
    </TableContainer>
  );
}
