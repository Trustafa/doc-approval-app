'use client';

import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Box, IconButton, Tab, Tabs, Typography } from '@mui/material';
import { useState } from 'react';
import DetailsBottomBar from '../_components/request-detailed/details-bottom-bar';
import ApprovalDetailsTable from '../_components/request-detailed/entry-request-details-table';

type DetailedViewProps = {
  data: ApprovalEntryData;
  onClickBack: () => void;
};

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

type ApprovalEntryData = {
  id: number;
  requestDate: string;
  payee: string;
  amount: number;
  currency: string;
  requester: string;
  status: string;
  approvers: string[];
};

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

export default function RequestDetailScreen({
  data,
  onClickBack,
}: DetailedViewProps) {
  const [tabVal, setTabVal] = useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabVal(newValue);
  };

  const handleApprove = (id: number) => {};

  const handleReject = (id: number) => {};
  return (
    <Box>
      <IconButton onClick={onClickBack} sx={{ zIndex: 10 }}>
        <ArrowBackIcon />
      </IconButton>
      <Typography variant="h2">{data.payee}</Typography>
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
          data={data}
          onApprove={handleApprove}
          onReject={handleReject}
        />
        <DetailsBottomBar amount={data.amount} />
      </CustomTabPanel>
      <CustomTabPanel value={tabVal} index={1}>
        Timeline
      </CustomTabPanel>
    </Box>
  );
}
