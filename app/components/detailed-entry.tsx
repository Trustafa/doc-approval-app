'use client';

import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Box, IconButton, Tab, Tabs, Typography } from '@mui/material';
import { useState } from 'react';
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
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
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
  return (
    <Box>
      <IconButton onClick={onClickBack} sx={{ zIndex: 10 }}>
        <ArrowBackIcon />
      </IconButton>
      <Typography variant="h2">{data.documentName}</Typography>
      <Typography variant="body1">{data.amount}</Typography>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs
          value={tabVal}
          onChange={handleChange}
          aria-label="basic tabs example"
        >
          <Tab label="Details" {...a11yProps(0)} />
          <Tab label="Timeline" {...a11yProps(1)} />
        </Tabs>
      </Box>
      <CustomTabPanel value={tabVal} index={0}>
        Details
      </CustomTabPanel>
      <CustomTabPanel value={tabVal} index={1}>
        Timeline
      </CustomTabPanel>
    </Box>
  );
}
