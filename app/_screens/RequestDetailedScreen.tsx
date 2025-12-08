'use client';

import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Box, IconButton, Tab, Tabs, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import DetailsBottomBar from '../_components/request-detailed/details-bottom-bar';
import ApprovalDetailsTable from '../_components/request-detailed/entry-request-details-table';
import { getApprovalsForRequest } from '../api/_client/approval.client';
import { getRequestByID } from '../api/_client/request.client';
import { handleApprove, handleReject } from './(views)/DesktopRequestsView';

type DetailedViewProps = {
  requestId: string;
  onClickBack: () => void;
};

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function CustomTabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
      {...other}
    >
      {value === index && <Box>{children}</Box>}
    </div>
  );
}
function a11yProps(index: number) {
  return {
    id: `tab-${index}`,
    'aria-controls': `tabpanel-${index}`,
  };
}

export default function RequestDetailScreen({
  requestId,
  onClickBack,
}: DetailedViewProps) {
  const [tabVal, setTabVal] = useState(0);
  const [data, setData] = useState({
    id: '',
    createdAt: new Date(),
    updatedAt: new Date(),

    payee: '',
    amount: 0,
    currency: '',
    approvalFileDate: new Date(),
    title: '',
    description: null,
    internalRef: null,
    externalRef: null,

    requester: undefined,
    approvalFile: undefined,

    status: null,
    idNumber: 0,
    approvers: [],
  });

  const [canApprove, setCanApprove] = useState(false);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabVal(newValue);
  };

  useEffect(() => {
    async function fetchRequestDetails() {
      const request = await getRequestByID(requestId);

      if (!request.success) {
        console.error(`Unable to retrieve request ${requestId}`);
        return;
      }

      const approvals = await getApprovalsForRequest(requestId);

      if (!approvals.success) {
        console.error(`Unable to retrieve approvers for request ${requestId}`);
        return;
      }

      setData({
        ...request.data,
        approvers: approvals.data.map((a) => a.approver.name) ?? [],
      });

      setCanApprove(approvals.canApprove);
    }

    fetchRequestDetails();
  }, [requestId]);
  return (
    <Box>
      <IconButton onClick={onClickBack} sx={{ mb: 2 }}>
        <ArrowBackIcon />
      </IconButton>
      <Box sx={{ display: 'flex', flexDirection: 'column', p: 1 }}>
        <Typography variant="subtitle1">{`ID: ${data.idNumber}`}</Typography>
        <Typography variant="h2" sx={{ mb: 2 }}>
          {data.payee}
        </Typography>
        <Typography variant="h5" sx={{ mb: 2 }}>
          {`${data.amount.toLocaleString(undefined, {
            minimumFractionDigits: 2,
          })} ${data.currency}`}
        </Typography>
      </Box>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs
          value={tabVal}
          onChange={handleChange}
          aria-label="Detailed View Tabs"
        >
          <Tab label="Details" {...a11yProps(0)} />
          <Tab label="Timeline" {...a11yProps(1)} />
        </Tabs>
      </Box>
      <CustomTabPanel value={tabVal} index={0}>
        <ApprovalDetailsTable data={data} />
      </CustomTabPanel>
      <CustomTabPanel value={tabVal} index={1}>
        Timeline
      </CustomTabPanel>
      {canApprove && (
        <DetailsBottomBar
          amount={data.amount}
          handleApprove={() => handleApprove(data.id)}
          handleReject={() => handleReject(data.id)}
        />
      )}
    </Box>
  );
}
