import {
  Check as CheckIcon,
  Clear as ClearIcon,
  FindInPage as FindInPageIcon,
} from '@mui/icons-material';
import { Card, CardContent, IconButton, Typography } from '@mui/material';
import { Box, SxProps, Theme } from '@mui/system';

type ApprovalEntryData = {
  id: number;
  documentName: string;
  date: string;
  amount: number;
};

type ApprovalEntryProps = {
  data: ApprovalEntryData;
  onClick: () => void;
  sx?: SxProps<Theme>;
};
export default function ApprovalEntry({
  data,
  onClick,
  sx,
}: ApprovalEntryProps) {
  return (
    <Card
      key={data.id}
      sx={{
        borderRadius: 2,
        boxShadow: 2,
        cursor: 'pointer',
        transition: '0.2s',
        '&:hover': {
          boxShadow: 4,
          transform: 'scale(1.01)',
        },
        maxWidth: '500px',
        ...sx,
      }}
      onClick={onClick}
    >
      <CardContent>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          flexWrap="wrap"
        >
          <Typography variant="h6">{data.documentName}</Typography>
        </Box>

        <Typography variant="caption" color="text.secondary">
          {data.date}
        </Typography>

        <Box
          mt={2}
          display="flex"
          justifyContent="space-between"
          alignItems="center"
        >
          <Typography variant="h6">{data.amount.toLocaleString()}</Typography>
          <Box display="flex" gap={1}>
            <IconButton
              aria-label="preview"
              onClick={(e) => e.stopPropagation()}
              onMouseDown={(e) => e.stopPropagation()}
            >
              <FindInPageIcon />
            </IconButton>
            <IconButton
              aria-label="approve"
              color="success"
              onClick={(e) => e.stopPropagation()}
              onMouseDown={(e) => e.stopPropagation()}
            >
              <CheckIcon />
            </IconButton>
            <IconButton
              aria-label="reject"
              color="error"
              onClick={(e) => e.stopPropagation()}
              onMouseDown={(e) => e.stopPropagation()}
            >
              <ClearIcon />
            </IconButton>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}
