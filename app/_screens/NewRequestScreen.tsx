'use client';
import { ArrowBack } from '@mui/icons-material';
import { Box, IconButton } from '@mui/material';
import { useRouter } from 'next/navigation';
import { useSnackbar } from 'notistack';
import RequestForm, { RequestInput } from '../_components/request-form';
import { submitRequest } from '../api/_client/request.client';

export default function NewRequestScreen() {
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();

  const onSubmit = async (data: RequestInput) => {
    const approvalDocID: string = data.approvalDoc[0].id;
    const supportingDocIDs: string[] = data.supportingDocs.map((doc) => doc.id);

    const res = await submitRequest({
      title: data.title,
      description: data.description,
      payee: data.payee,
      amount: data.amount,
      currency: data.currency,
      internalRef: data.internalRef,
      externalRef: data.externalRef,
      approverIds: data.approvers,
      approvalFileId: approvalDocID,
      supportingFileIds: supportingDocIDs,
      approvalFileDate: new Date(),
    });

    if (!res.success) {
      enqueueSnackbar(`Unable to submit request`, { variant: 'error' });
      return;
    }

    router.push('/dashboard/requests/sent');
  };

  return (
    <Box sx={{ p: 2 }}>
      <IconButton onClick={() => router.back()} sx={{ zIndex: 10 }}>
        <ArrowBack />
      </IconButton>
      <RequestForm title="New Request" onSubmit={onSubmit} />
    </Box>
  );
}
