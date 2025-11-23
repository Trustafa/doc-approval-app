'use client';

import RequestsScreen from '@/app/_screens/RequestsScreen';
import { Add } from '@mui/icons-material';
import { IconButton } from '@mui/material';
import { useRouter } from 'next/navigation';

export default function SentRequestsPage() {
  const router = useRouter();
  const approvals = [
    {
      id: 1,
      documentName: 'Invoice 1',
      date: '10-11-2025',
      amount: 10000,
      requester: 'Bob',
      approvers: ['Alice', 'George'],
      status: 'PENDING' as const,
    },
    {
      id: 2,
      documentName: 'Invoice 2',
      date: '09-11-2025',
      amount: 15000,
      requester: 'Bob',
      approvers: ['Alice', 'George'],
      status: 'PENDING' as const,
    },
    {
      id: 3,
      documentName: 'Invoice 3',
      date: '07-11-2025',
      amount: 104500,
      requester: 'Bob',
      approvers: ['Alice', 'George'],
      status: 'PENDING' as const,
    },
  ];

  const add_form_button = (
    <IconButton
      aria-label="add_request"
      color="inherit"
      onClick={() => router.push('/dashboard/requests/sent/new')}
      sx={{
        backgroundColor: '#1976d2',
        color: 'white',
        width: 48,
        height: 48,
        borderRadius: '50%',
        boxShadow: 2,
        '&:hover': {
          backgroundColor: '#115293',
        },
      }}
    >
      <Add />
    </IconButton>
  );
  return (
    <RequestsScreen
      data={approvals}
      baseRoute="/dashboard/requests/sent"
      title="Sent Requests"
      headerAction={add_form_button}
    />
  );
}
