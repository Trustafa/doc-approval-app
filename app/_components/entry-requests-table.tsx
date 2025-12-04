import { colors } from '@/utils/colors';
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from '@mui/material';
import { useRouter } from 'next/navigation';
import {
  handleApprove,
  handleReject,
} from '../_screens/(views)/DesktopRequestsView';
import { RequestType } from '../_types/request';
import { RequestResponse } from '../api/_services/request.service';
import ApproveButton from './buttons/approve-button';
import PreviewButton from './buttons/preview-button';
import RejectButton from './buttons/reject-button';

type RequestsTableProps = {
  data: RequestResponse[];
  baseRoute: string;
  requestType: RequestType;
  canApproveMap: Record<string, boolean>;
};

export default function RequestsTable({
  data,
  baseRoute,
  requestType,
  canApproveMap,
}: RequestsTableProps) {
  const router = useRouter();

  return (
    <Table
      sx={{
        borderCollapse: 'separate',
        borderSpacing: '0 12px',
      }}
    >
      <TableHead>
        <TableRow
          sx={{
            background: '#fff',
            borderRadius: 2,
            boxShadow: '0px 2px 8px rgba(0,0,0,0.05)',
            overflow: 'hidden',
          }}
        >
          <TableCell>ID</TableCell>
          <TableCell>Request Date</TableCell>
          <TableCell>Payee</TableCell>
          <TableCell>Amount</TableCell>
          <TableCell>Currency</TableCell>

          {requestType === 'Received' ? (
            <>
              <TableCell>Requester</TableCell>
              <TableCell />
            </>
          ) : (
            <>
              <TableCell>Internal Ref</TableCell>
              <TableCell>External Ref</TableCell>
              <TableCell />
            </>
          )}
        </TableRow>
      </TableHead>

      <TableBody>
        {data.map((req) => (
          <TableRow
            key={req.id}
            sx={{
              background: (() => {
                switch (req.status) {
                  case 'APPROVED':
                    return colors.approved;
                  case 'PENDING':
                    return colors.pending;
                  case 'REJECTED':
                    return colors.rejected;
                  default:
                    return colors.white;
                }
              })(),
              borderRadius: 2,
              boxShadow: '0px 2px 8px rgba(0,0,0,0.05)',
              overflow: 'hidden',
              cursor: 'pointer',
              transition: '0.2s',
              '&:hover': {
                boxShadow: 4,
                transform: 'scale(1.01)',
              },
            }}
            onClick={() => router.push(`${baseRoute}/${req.id}`)}
          >
            <TableCell>{req.idNumber}</TableCell>
            <TableCell>{req.createdAt.toLocaleDateString('en-GB')}</TableCell>
            <TableCell>{req.payee}</TableCell>
            <TableCell>{req.amount.toFixed(2)}</TableCell>
            <TableCell>{req.currency}</TableCell>
            {requestType === 'Received' ? (
              <>
                <TableCell>{req.requester?.name}</TableCell>
              </>
            ) : (
              <>
                <TableCell>{req.internalRef}</TableCell>
                <TableCell>{req.externalRef}</TableCell>
              </>
            )}
            <TableCell>
              <Box display="flex" gap={1}>
                <PreviewButton requestId={req.idNumber} />
                {(canApproveMap?.[req.id] ?? false) && (
                  <>
                    <ApproveButton onClick={() => handleApprove(req.id)} />
                    <RejectButton onClick={() => handleReject(req.id)} />
                  </>
                )}
              </Box>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
