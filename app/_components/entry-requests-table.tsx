import { ApprovalDecision } from '@/generated/prisma/enums';
import { colors } from '@/utils/colors';
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
} from '@mui/material';
import { useRouter } from 'next/navigation';
import { RequestType } from '../_types/request';
import { openApprovalFilePreview } from '../api/_client/file.client';
import { RequestResponse } from '../api/_services/request.service';
import ActionButton from './action-button';

type RequestsTableProps = {
  data: RequestResponse[];
  baseRoute: string;
  requestType: RequestType;
  paginationProps: {
    page: number;
    setPage: (page: number) => void;
    totalCount: number;
    rowsPerPage: number;
  };
};

const columnWidths = {
  id: '5%',
  date: '9%',
  payee: '18%',
  title: '18%',
  amount: '10%',
  currency: '5%',
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
  paginationProps,
}: RequestsTableProps) {
  const router = useRouter();

  const { page, setPage, totalCount, rowsPerPage } = paginationProps;

  return (
    <Box>
      <Box display="flex" justifyContent="flex-end" mb={1}>
        <TablePagination
          component="div"
          count={totalCount}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={(_, newPage) => setPage(newPage)}
          rowsPerPageOptions={[]}
          onRowsPerPageChange={undefined}
        />
      </Box>
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
            <TableCell sx={{ width: columnWidths.title }}>Title</TableCell>
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
              <TableCell>{req.title}</TableCell>
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
                    onClick={() => openApprovalFilePreview(req.id)}
                  />
                </Box>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Box>
  );
}
