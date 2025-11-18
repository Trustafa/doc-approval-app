import { Box, Typography } from '@mui/material';
import ApprovalEntry from '../_components/entry-approval';
import { ApprovalEntryData } from '../dashboard/received-requests/page';

type ApprovalsScreenProps = {
  onEntryClick: (data: ApprovalEntryData) => void;
};

export default function ApprovalsScreen({
  onEntryClick,
}: ApprovalsScreenProps) {
  const approvals = [
    {
      id: 1,
      documentName: 'Project Proposal',
      requester: 'Alice',
      approvers: ['Bob', 'Charlie'],
      amount: 5000,
      status: 'PENDING' as const,
      date: '2025-11-11',
    },
    {
      id: 2,
      documentName: 'Invoice 2',
      requester: 'Alice',
      approvers: ['Bob', 'Charlie'],
      amount: 5000,
      status: 'PENDING' as const,
      date: '2025-11-11',
    },
    {
      id: 3,
      documentName: 'Invoice',
      requester: 'Alice',
      approvers: ['Bob', 'Charlie'],
      amount: 5000,
      status: 'PENDING' as const,
      date: '2025-11-11',
    },
  ];
  return (
    <Box
      sx={{
        alignContent: 'center',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Typography variant="h2" sx={{ mb: 4 }}>
        Approvals
      </Typography>
      {approvals.map((item) => (
        <ApprovalEntry
          key={item.id}
          data={item}
          sx={{ mb: 2 }}
          onClick={() => onEntryClick(item)}
        />
      ))}
    </Box>
  );
}
