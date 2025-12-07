import { Box, Card, Typography } from '@mui/material';
import { ReactNode } from 'react';

type SummaryCardProps = {
  title: string;
  caption: string;
  count: number;
  icon: ReactNode;
};

export default function SummaryCard({
  title,
  caption,
  count,
  icon,
}: SummaryCardProps) {
  return (
    <Card
      sx={{
        borderRadius: 3,
        position: 'relative',
        overflow: 'hidden',
        maxWidth: 460,
        p: 3,
        minHeight: 100,
      }}
    >
      {/* Watermark Icon */}
      <Box
        sx={{
          position: 'absolute',
          right: -30,
          top: -10,
          fontSize: 120,
          color: '#e7e7e7',
          opacity: 0.5,
        }}
      >
        {icon}
      </Box>

      <Typography variant="h6" fontWeight="600">
        {title}
      </Typography>

      <Typography variant="body2" color="text.secondary" mb={1}>
        {caption}
      </Typography>

      <Box display="flex" alignItems="baseline" gap={1}>
        <Typography
          variant="h1"
          color="primary"
          fontWeight={100}
          sx={{ lineHeight: 1 }}
        >
          {count}
        </Typography>

        <Typography variant="body1" color="text.secondary">
          Items
        </Typography>
      </Box>
    </Card>
  );
}
