import { currencyCodes } from '@/utils/constants';
import { Box, Button, Typography } from '@mui/material';
import { enqueueSnackbar } from 'notistack';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { getUsers } from '../api/_client/user.client';
import ControlledFileUpload, {
  UploadedFileSummary,
} from './controlled/controlled-file-upload';
import { ControlledMultiSelect } from './controlled/controlled-multi-select';
import ControlledNumericField from './controlled/controlled-numeric-field';
import ControlledStyledTextField from './controlled/controlled-styled-text-field';
import {
  ControlledUserSelect,
  UserData,
} from './controlled/controlled-user-select';

export type RequestInput = {
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

type RequestFormProps = {
  onSubmit: (data: RequestInput) => void;
  title: string;
  defaultValues?: Partial<RequestInput>;
};

export default function RequestForm({
  onSubmit,
  title,
  defaultValues,
}: RequestFormProps) {
  const { handleSubmit, control, reset } = useForm<RequestInput>({
    defaultValues: {
      internalRef: '',
      externalRef: '',
      title: 'lol',
      payee: '',
      amount: undefined,
      currency: undefined,
      approvers: [] as string[],
      description: '',
      approvalDoc: [],
      supportingDocs: [],
    },
  });

  useEffect(() => {
    if (defaultValues) {
      // Wrap single files in array if needed
      reset({
        ...defaultValues,
      });
    }
  }, [defaultValues, reset]);

  const fetchUsers = async (): Promise<UserData[]> => {
    const res = await getUsers({ omitSelf: true });

    if (!res.success) {
      enqueueSnackbar('Unable to fetch users', { variant: 'error' });
      return [];
    }

    return res.data.map((user) => ({ id: user.id, name: user.name }));
  };

  return (
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
        {title}
      </Typography>
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          justifyContent: 'space-between',
          gap: 2,
        }}
      >
        <ControlledStyledTextField<RequestInput>
          name="internalRef"
          control={control}
          label="Internal Ref"
        />
        <ControlledStyledTextField<RequestInput>
          name="externalRef"
          control={control}
          label="External Ref"
        />
      </Box>
      <ControlledStyledTextField<RequestInput>
        name="title"
        control={control}
        label="Title*"
        rules={{ required: 'Title is required' }}
        placeholder="Enter title"
      />
      <ControlledStyledTextField<RequestInput>
        name="description"
        control={control}
        label="Description"
        placeholder="Enter description"
        multiline
        rows={6}
      />
      <ControlledStyledTextField<RequestInput>
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
        <ControlledNumericField<RequestInput>
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

        <ControlledMultiSelect<RequestInput>
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
  );
}
