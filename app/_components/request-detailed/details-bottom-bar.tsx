'use client';

import {
  Box,
  Button,
  Paper,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import ApproveButton from '../buttons/approve-button';
import RejectButton from '../buttons/reject-button';

type DetailsBottomBarProps = {
  amount: number;
  handleApprove: () => void;
  handleReject: () => void;
};

export default function DetailsBottomBar({
  amount,
  handleApprove,
  handleReject,
}: DetailsBottomBarProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  return (
    <Paper
      sx={{
        position: 'fixed',
        bottom: 0,
        left: isMobile ? '0px' : '240px',
        right: 0,
        p: 2,
        display: isMobile ? 'normal' : 'flex',
        flexDirection: isMobile ? 'column' : 'normal',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderTop: '1px solid #ccc',
        zIndex: 1000,
      }}
      elevation={3}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mr: 1 }}>
          Amount:
        </Typography>
        <Typography variant="subtitle1">{amount.toFixed(2)}</Typography>
      </Box>

      <Box sx={{ display: 'flex', gap: 1, justifyContent: 'space-between' }}>
        <ApproveButton
          onClick={handleApprove}
          button={
            <Button
              variant="contained"
              color="success"
              onClick={() => {}}
              sx={{ mr: 1, width: isMobile ? '100%' : 'default' }}
            >
              Approve
            </Button>
          }
        />
        <RejectButton
          onClick={handleReject}
          button={
            <Button
              variant="contained"
              color="error"
              onClick={() => {}}
              sx={{ mr: 1, width: isMobile ? '100%' : 'default' }}
            >
              Reject
            </Button>
          }
        />
      </Box>
    </Paper>
  );
}
