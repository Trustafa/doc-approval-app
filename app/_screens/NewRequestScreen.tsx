'use client';
import { currencyCodes } from '@/utils/constants';
import { ArrowBack } from '@mui/icons-material';
import { Box, Button, IconButton, Typography } from '@mui/material';
import { useRouter } from 'next/navigation';
import { useSnackbar } from 'notistack';
import { useForm } from 'react-hook-form';
import ControlledFileUpload, {
  UploadedFileSummary,
} from '../_components/controlled/controlled-file-upload';
import { ControlledMultiSelect } from '../_components/controlled/controlled-multi-select';
import ControlledStyledTextField from '../_components/controlled/controlled-styled-text-field';
import {
  ControlledUserSelect,
  UserData,
} from '../_components/controlled/controlled-user-select';
import { submitRequest } from '../api/_client/request.client';
import { getUsers } from '../api/_client/user.client';

type NewRequestInput = {
  internalRef: string;
  externalRef: string;
  title: string;
  payee: string;
  amount: number;
  currency: string;
  description: string;
  approvers: string[];
  approvalDoc: UploadedFileSummary[];
  supportingDocs: UploadedFileSummary[];
};

export default function NewRequestScreen() {
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();

  const { handleSubmit, control } = useForm<NewRequestInput>({
    defaultValues: {
      internalRef: '',
      externalRef: '',
      title: '',
      payee: '',
      amount: 0,
      currency: '',
      approvers: [] as string[],
      description: '',
      approvalDoc: [],
      supportingDocs: [],
    },
  });

  const fetchUsers = async (): Promise<UserData[]> => {
    const res = await getUsers({ omitSelf: true });

    if (!res.success) {
      enqueueSnackbar('Unable to fetch users', { variant: 'error' });
      return [];
    }

    return res.data.map((user) => ({ id: user.id, name: user.name }));
  };
  const onSubmit = async (data: NewRequestInput) => {
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
      <Box
        component="form"
        onSubmit={handleSubmit(onSubmit)}
        autoComplete="off"
        sx={{
          maxWidth: 700,
          mx: 'auto',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Typography variant="h4" sx={{ mb: 3, textAlign: 'center' }}>
          New Request
        </Typography>
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            justifyContent: 'space-between',
            gap: 2,
          }}
        >
          <ControlledStyledTextField<NewRequestInput>
            name="internalRef"
            control={control}
            label="Internal Ref"
          />
          <ControlledStyledTextField<NewRequestInput>
            name="externalRef"
            control={control}
            label="External Ref"
          />
        </Box>
        <ControlledStyledTextField<NewRequestInput>
          name="title"
          control={control}
          label="Title*"
          rules={{ required: 'Title is required' }}
          placeholder="Enter title"
        />
        <ControlledStyledTextField<NewRequestInput>
          name="description"
          control={control}
          label="Description"
          placeholder="Enter description"
          multiline
          rows={6}
        />
        <ControlledStyledTextField<NewRequestInput>
          name="payee"
          control={control}
          label="Payee*"
          rules={{ required: 'Payee is required' }}
          placeholder="Enter payee"
        />
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            justifyContent: 'space-between',
            gap: 2,
          }}
        >
          <ControlledStyledTextField<NewRequestInput>
            name="amount"
            control={control}
            type="number"
            label="Amount*"
            rules={{
              required: 'Amount is required',
              min: { value: 0.01, message: 'Amount must be greater than 0' },
            }}
            placeholder="Enter amount"
          />

          <ControlledMultiSelect<NewRequestInput>
            name="currency"
            control={control}
            label="Currency*"
            rules={{ required: 'Currency is required' }}
            placeholder="Enter Currency"
            options={currencyCodes}
          />
        </Box>
        <ControlledUserSelect
          name="approvers"
          label="Approvers*"
          control={control}
          fetchUsers={fetchUsers}
          rules={{ required: 'Atleast 1 Approver is required' }}
        />

        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            justifyContent: 'space-between',
            gap: 2,
          }}
        >
          <ControlledFileUpload
            name="approvalDoc"
            control={control}
            label="Approval Document*"
            rules={{ required: 'File is required' }}
          />
          <ControlledFileUpload
            name="supportingDocs"
            control={control}
            label="Supporting Documents"
            multiple
          />
        </Box>
        <Button variant="contained" color="primary" type="submit">
          Submit
        </Button>
      </Box>
    </Box>
  );
}
