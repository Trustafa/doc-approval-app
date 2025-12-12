'use client';

import {
  downloadFile,
  openPreview,
  openSignedApprovalFile,
} from '@/app/api/_client/file.client';
import { RequestResponseWithFiles } from '@/app/api/_services/request.service';
import { FileDownloadOutlined } from '@mui/icons-material';
import {
  Box,
  Button,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
} from '@mui/material';

type ApprovalTableProps = {
  data: RequestResponseWithFiles & { approvers: string[] };
};

type ApprovalTableRowProps = {
  header: string;
  data: React.ReactNode;
};

function ApprovalTableRow({ header, data }: ApprovalTableRowProps) {
  return (
    <TableRow>
      <TableCell
        sx={{ fontWeight: 'bold', width: { xs: '100px', md: '200px' } }}
      >
        {header}
      </TableCell>
      <TableCell>{data}</TableCell>
    </TableRow>
  );
}

export default function ApprovalDetailsTable({ data }: ApprovalTableProps) {
  const isApproved = data.status === 'APPROVED';
  return (
    <TableContainer component={Paper} sx={{ borderRadius: 2, mb: 3 }}>
      <Table key={data.id}>
        <TableBody>
          <ApprovalTableRow header="Title" data={data.title} />

          <ApprovalTableRow
            header="Description"
            data={data.description || '—'}
          />
          <ApprovalTableRow header="Payee" data={data.payee} />

          <ApprovalTableRow
            header="Amount"
            data={`${data.amount.toLocaleString(undefined, {
              minimumFractionDigits: 2,
            })} ${data.currency}`}
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
            header="Status"
            data={data.status?.toString() ?? '—'}
          />

          <ApprovalTableRow
            header="Created At"
            data={new Date(data.createdAt).toLocaleString()}
          />

          <ApprovalTableRow
            header="Approval Document"
            data={
              <Box sx={{ display: 'flex' }}>
                <Button
                  onClick={() => openPreview(data.approvalFile?.id ?? '')}
                  variant="hyperlink"
                >
                  {data.approvalFile?.filename ?? '-'}
                </Button>

                <IconButton
                  onClick={() => downloadFile(data.approvalFile?.id ?? '')}
                  sx={{ ml: 2 }}
                  size="medium"
                >
                  <FileDownloadOutlined />
                </IconButton>
              </Box>
            }
          />
          <ApprovalTableRow
            header="Signed Approval Document"
            data={
              <Box sx={{ display: 'flex' }}>
                <Button
                  disabled={!isApproved}
                  onClick={() => openSignedApprovalFile(data.id)}
                  variant="hyperlink"
                >
                  {isApproved ? 'Signed Document' : 'No Signed Document'}
                </Button>
                {isApproved && (
                  <IconButton
                    onClick={() =>
                      openSignedApprovalFile(data.id, { download: true })
                    }
                    sx={{ ml: 2 }}
                    size="medium"
                  >
                    <FileDownloadOutlined />
                  </IconButton>
                )}
              </Box>
            }
          />

          <ApprovalTableRow
            header="Supporting Documents"
            data={
              data.supportingFiles?.length ? (
                data.supportingFiles?.map((file) => {
                  return (
                    <Box sx={{ display: 'flex' }} key={file.id}>
                      <Button
                        onClick={() => openPreview(file.id)}
                        variant="hyperlink"
                      >
                        {file.filename}
                      </Button>

                      <IconButton
                        onClick={() => downloadFile(file.id)}
                        sx={{ ml: 2 }}
                        size="medium"
                      >
                        <FileDownloadOutlined />
                      </IconButton>
                    </Box>
                  );
                })
              ) : (
                <Button disabled variant="hyperlink">
                  {'No Supporting Documents'}
                </Button>
              )
            }
          />
        </TableBody>
      </Table>
    </TableContainer>
  );
}
