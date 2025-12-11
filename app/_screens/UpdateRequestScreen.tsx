'use client';
import { ArrowBack } from '@mui/icons-material';
import { Box, IconButton } from '@mui/material';
import { useRouter } from 'next/navigation';
import { useSnackbar } from 'notistack';
import { useEffect, useState } from 'react';
import RequestForm, { RequestInput } from '../_components/request-form';
import { getApproversForRequest } from '../api/_client/approval.client';
import { getRequestByID, updateRequest } from '../api/_client/request.client';
import { RequestResponseWithFiles } from '../api/_services/request.service';

type UpdateRequestScreenProps = {
  requestId: string;
};

export default function UpdateRequestScreen({
  requestId,
}: UpdateRequestScreenProps) {
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();
  const [requestData, setRequestData] = useState<
    RequestResponseWithFiles & { approverIds: string[] }
  >();

  useEffect(() => {
    async function loadRequestData() {
      const res = await getRequestByID(requestId);
      let msg = '';
      if (!res.success) {
        switch (res.status) {
          case 400:
            msg = 'Invalid Input';
            break;
          case 404:
            msg = 'Request not found';
            break;
          case 403:
            msg = 'Forbidden';
            break;
          default:
            msg = 'Unable to update request';
            break;
        }
        enqueueSnackbar(msg, { variant: 'error' });
        return;
      }

      const approverRes = await getApproversForRequest(requestId);

      if (!approverRes.success) {
        enqueueSnackbar('Unable to fetch approvers for this request', {
          variant: 'error',
        });
        return;
      }

      const ids = approverRes.data.map((a) => a.id);
      setRequestData({ ...res.data, approverIds: ids });
    }

    loadRequestData();
  }, []);

  const onSubmit = async (data: RequestInput) => {
    const approvalDocID: string = data.approvalDoc[0].id;
    const supportingDocIDs: string[] = data.supportingDocs.map((doc) => doc.id);

    let approvalFileDate = new Date();

    if (approvalDocID === requestData?.approvalFile?.id) {
      approvalFileDate = requestData.approvalFileDate;
    }

    const res = await updateRequest({
      id: requestId,
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
      approvalFileDate: approvalFileDate,
    });

    if (!res.success) {
      enqueueSnackbar(`Unable to update request`, { variant: 'error' });
      return;
    }

    router.back();
  };

  return (
    <Box sx={{ p: 2 }}>
      <IconButton onClick={() => router.back()} sx={{ zIndex: 10 }}>
        <ArrowBack />
      </IconButton>
      <RequestForm
        title="Update Request"
        onSubmit={onSubmit}
        defaultValues={{
          internalRef: requestData?.internalRef ?? '',
          externalRef: requestData?.externalRef ?? '',
          title: requestData?.title ?? '',
          payee: requestData?.payee ?? '',
          amount: requestData?.amount ?? undefined,
          currency: requestData?.currency ?? undefined,
          approvers: requestData?.approverIds ?? [],
          description: requestData?.description ?? '',
          approvalDoc: requestData?.approvalFile
            ? [requestData.approvalFile]
            : [],
          supportingDocs: requestData?.supportingFiles ?? [],
        }}
      />
    </Box>
  );
}
