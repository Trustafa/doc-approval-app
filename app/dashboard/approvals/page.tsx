'use client';

import ApprovalEntry from '@/app/components/approval-entry';
import DetailedView from '@/app/components/detailed-entry';
import { Box } from '@mui/system';
import { useState } from 'react';

type ApprovalEntryData = {
  id: number;
  documentName: string;
  date: string;
  amount: number;
};

export default function Page() {
  const [selected, setSelected] = useState<ApprovalEntryData | null>(null);

  const approvals = [
    { id: 1, documentName: 'Invoice 1', date: '10-11-2025', amount: 10000 },
    { id: 2, documentName: 'Invoice 2', date: '09-11-2025', amount: 15000 },
    {
      id: 3,
      documentName: 'Invoice 3',
      date: '07-11-2025',
      amount: 104500,
    },
  ];

  if (selected) {
    // Detail View
    return (
      <DetailedView data={selected} onClickBack={() => setSelected(null)} />
    );
  }

  return (
    <Box>
      {approvals.map((item) => (
        <ApprovalEntry
          key={item.id}
          data={item}
          sx={{ mb: 2 }}
          onClick={() => setSelected(item)}
        />
      ))}
    </Box>
  );
}
