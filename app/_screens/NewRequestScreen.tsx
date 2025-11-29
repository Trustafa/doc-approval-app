'use client';
import { ArrowBack } from '@mui/icons-material';
import { Box, Button, IconButton, Typography } from '@mui/material';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import ControlledFileUpload from '../_components/controlled/controlled-file-upload';
import { ControlledMultiSelect } from '../_components/controlled/controlled-multi-select';
import ControlledStyledTextField from '../_components/controlled/controlled-styled-text-field';

type NewRequestInput = {
  internalRef: string;
  externalRef: string;
  payee: string;
  amount: number;
  currency: string;
  description: string;
  approvers: string[];
  approvalDoc: FileList | null;
  supportingDocs: FileList | null;
};
const allApprovers = ['Bob', 'Mustafa', 'Alice', 'Charlie', 'David'];
export default function NewRequestScreen() {
  const router = useRouter();

  const { handleSubmit, control } = useForm<NewRequestInput>({
    defaultValues: {
      internalRef: '',
      externalRef: '',
      payee: '',
      amount: 0,
      currency: '',
      approvers: [] as string[],
      description: '',
      approvalDoc: null,
      supportingDocs: null,
    },
  });

  const onSubmit = (data: NewRequestInput) => {
    console.log('FORM DATA:', data);
  };

  return (
    <Box>
      <IconButton onClick={() => router.back()} sx={{ zIndex: 10 }}>
        <ArrowBack />
      </IconButton>
      <Box
        component="form"
        onSubmit={handleSubmit(onSubmit)}
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

          <ControlledStyledTextField<NewRequestInput>
            name="currency"
            control={control}
            label="Currency*"
            rules={{ required: 'Currency is required' }}
            placeholder="Enter Currency"
          />
        </Box>
        <ControlledMultiSelect
          name="approvers"
          label="Approvers*"
          control={control}
          options={allApprovers}
          rules={{ required: 'Atleast 1 Approver is required' }}
        />
        <ControlledStyledTextField<NewRequestInput>
          name="description"
          control={control}
          label="Description"
          placeholder="Enter description"
          multiline
          rows={6}
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
