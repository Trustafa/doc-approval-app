'use client';

import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Box, IconButton, Tab, Tabs, Typography } from '@mui/material';
import { useState } from 'react';
import DetailsBottomBar from './details-bottom-bar';
import ApprovalDetailsTable from './entry-approval-details-table';
type ApprovalEntryData = {
  id: number;
  documentName: string;
  date: string;
  amount: number;
};

type DetailedViewProps = {
  data: ApprovalEntryData;
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
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box>{children}</Box>}
    </div>
  );
}
function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

export default function DetailedView({ data, onClickBack }: DetailedViewProps) {
  const [tabVal, setTabVal] = useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabVal(newValue);
  };

  const [approvals, setApprovals] = useState({
    id: 1,
    documentName: 'Project Proposal',
    requester: 'Alice',
    approvers: ['Bob', 'Charlie'],
    amount: 5000,
    status: 'PENDING' as const,
    date: '2025-11-11',
  });

  const handleApprove = (id: number) => {};

  const handleReject = (id: number) => {};
  return (
    <Box>
      <IconButton onClick={onClickBack} sx={{ zIndex: 10 }}>
        <ArrowBackIcon />
      </IconButton>
      <Typography variant="h2">{data.documentName}</Typography>
      <Typography variant="h5" sx={{ mb: 2 }}>
        {data.amount.toLocaleString()}
      </Typography>
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
        <ApprovalDetailsTable
          data={approvals}
          onApprove={handleApprove}
          onReject={handleReject}
        />
        <DetailsBottomBar amount={approvals.amount} />
      </CustomTabPanel>
      <CustomTabPanel value={tabVal} index={1}>
        Timeline
      </CustomTabPanel>
    </Box>
  );
}
