'use client';

import { colors } from '@/utils/colors';
import { Card, CardContent, Typography } from '@mui/material';
import { Box, SxProps, Theme } from '@mui/system';
import { RequestResponse } from '../api/_services/request.service';
import ActionButton from './action-button';

type ApprovalEntryProps = {
  data: RequestResponse;
  onClick: () => void;
  openPreview: (id: string) => void;
  sx?: SxProps<Theme>;
};
export function RequestEntry({
  data,
  onClick,
  openPreview,
  sx,
}: ApprovalEntryProps) {
  return (
    <Card
      key={data.id}
      sx={{
        borderRadius: 2,
        boxShadow: 2,
        cursor: 'pointer',
        transition: '0.2s',
        '&:hover': {
          boxShadow: 4,
          transform: 'scale(1.01)',
        },
        maxWidth: '500px',
        background: (() => {
          switch (data.status) {
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
        margin: 2,
        ...sx,
      }}
      onClick={onClick}
    >
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="caption">
            {`ID ${data.idNumber} • `}
            {data.payee}
          </Typography>
        </Box>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mt={2}
        >
          <Typography variant="subtitle1">{data.title}</Typography>
        </Box>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h4">
            {data.amount.toLocaleString(undefined, {
              minimumFractionDigits: 2,
            })}
            {` ${data.currency}`}
          </Typography>
        </Box>

        <Box
          mt={2}
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          gap={1}
        >
          <Typography variant="body1" color="text.secondary">
            {new Date(data.createdAt).toLocaleDateString('en-GB', {
              weekday: 'short',
              day: '2-digit',
              month: 'short',
              year: 'numeric',
            })}
          </Typography>
          <Box display="flex" gap={1}>
            <ActionButton
              buttonType="Preview"
              onClick={() => openPreview(data.approvalFile?.id ?? '')}
            />
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}
