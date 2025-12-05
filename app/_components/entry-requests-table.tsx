import { ApprovalDecision } from '@/generated/prisma/enums';
import { usePreviewDialog } from '@/hooks/use-preview-dialog';
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
import ActionButton from './action-button';

type RequestsTableProps = {
  data: RequestResponse[];
  baseRoute: string;
  requestType: RequestType;
  canApproveMap: Record<string, boolean>;
};

const columnWidths = {
  id: '8%',
  date: '12%',
  payee: '28%',
  amount: '12%',
  currency: '8%',
  requester: '20%',
  internalRef: '10%',
  externalRef: '10%',
  actions: '12%',
};

function getRowBackgroundColor(status: ApprovalDecision | null) {
  switch (status) {
    case 'APPROVED':
      return colors.approved;
    case 'PENDING':
      return colors.pending;
    case 'REJECTED':
      return colors.rejected;
    default:
      return colors.white;
  }
}
export default function RequestsTable({
  data,
  baseRoute,
  requestType,
  canApproveMap,
}: RequestsTableProps) {
  const router = useRouter();
  const { openPreview, dialog } = usePreviewDialog();

  return (
    <Box>
      <Table
        sx={{
          borderCollapse: 'separate',
          padding: 2,
          backgroundColor: colors.white,
        }}
      >
        <TableHead>
          <TableRow>
            <TableCell sx={{ width: columnWidths.id }}>ID</TableCell>
            <TableCell sx={{ width: columnWidths.date }}>
              Request Date
            </TableCell>
            <TableCell sx={{ width: columnWidths.payee }}>Payee</TableCell>
            <TableCell sx={{ width: columnWidths.amount }}>Amount</TableCell>
            <TableCell sx={{ width: columnWidths.currency }}>
              Currency
            </TableCell>

            {requestType === 'Received' ? (
              <>
                <TableCell sx={{ width: columnWidths.requester }}>
                  Requester
                </TableCell>
                <TableCell sx={{ width: columnWidths.actions }} />
              </>
            ) : (
              <>
                <TableCell sx={{ width: columnWidths.internalRef }}>
                  Internal Ref
                </TableCell>
                <TableCell sx={{ width: columnWidths.externalRef }}>
                  External Ref
                </TableCell>
                <TableCell sx={{ width: columnWidths.actions }} />
              </>
            )}
          </TableRow>
        </TableHead>

        <TableBody>
          {data.map((req) => (
            <TableRow
              hover
              key={req.id}
              sx={{
                backgroundColor: (() => getRowBackgroundColor(req.status))(),
                '&.MuiTableRow-root:hover': {
                  backgroundColor: (() => getRowBackgroundColor(req.status))(),
                },
              }}
              onClick={() => router.push(`${baseRoute}/${req.id}`)}
            >
              <TableCell>{req.idNumber}</TableCell>
              <TableCell>{req.createdAt.toLocaleDateString('en-GB')}</TableCell>
              <TableCell>{req.payee}</TableCell>
              <TableCell>
                {req.amount.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                })}
              </TableCell>
              <TableCell>{req.currency}</TableCell>
              {requestType === 'Received' ? (
                <>
                  <TableCell>{req.requester?.name ?? ''}</TableCell>
                </>
              ) : (
                <>
                  <TableCell>{req.internalRef}</TableCell>
                  <TableCell>{req.externalRef}</TableCell>
                </>
              )}
              <TableCell>
                <Box display="flex" gap={1}>
                  <ActionButton
                    buttonType="Preview"
                    onClick={() => openPreview(req.approvalFile?.id ?? '')}
                  />

                  {(canApproveMap?.[req.id] ?? false) && (
                    <>
                      <ActionButton
                        buttonType="Approve"
                        onClick={() => handleApprove(req.id)}
                      />
                      <ActionButton
                        buttonType="Reject"
                        onClick={() => handleReject(req.id)}
                      />
                    </>
                  )}
                </Box>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {dialog}
    </Box>
  );
}
