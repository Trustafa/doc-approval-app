'use client';
import { ArrowBack } from '@mui/icons-material';
import { Box, Button, IconButton, Typography } from '@mui/material';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import ControlledFileUpload from '../_components/controlled/controlled-file-upload';
import { ControlledMultiSelect } from '../_components/controlled/controlled-multi-select';
import ControlledStyledTextField from '../_components/controlled/controlled-styled-text-field';

type NewRequestInput = {
  payee: string;
  amount: number;
  description: string;
  approvers: string[];
  file: FileList | null;
};
const allApprovers = ['Bob', 'Mustafa', 'Alice', 'Charlie', 'David'];
export default function NewRequestScreen() {
  const router = useRouter();

  const { handleSubmit, control } = useForm<NewRequestInput>({
    defaultValues: {
      payee: '',
      amount: 1,
      approvers: [] as string[],
      description: '',
      file: null,
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
          maxWidth: 500,
          mx: 'auto',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Typography variant="h4" sx={{ mb: 3, textAlign: 'center' }}>
          New Request
        </Typography>
        <ControlledStyledTextField<NewRequestInput>
          name="payee"
          control={control}
          label="Payee*"
          rules={{ required: 'Payee is required' }}
          placeholder="Enter payee"
        />
        <ControlledStyledTextField<NewRequestInput>
          name="amount"
          control={control}
          type="number"
          label="Amount*"
          rules={{
            required: 'Amount is required',
            min: { value: 0.01, message: 'Amount must be > 0' },
          }}
          placeholder="Enter amount"
        />
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
        <ControlledFileUpload
          name="file"
          control={control}
          label="File*"
          rules={{ required: 'File is required' }}
        />
        <Button variant="contained" color="primary" type="submit">
          Submit
        </Button>
      </Box>
    </Box>
  );
}
