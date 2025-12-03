import { rejectRequest } from '@/app/api/_client/approval.client';
import { Clear } from '@mui/icons-material';
import { IconButton } from '@mui/material';

type RejectButtonProps = {
  button?: React.ReactNode;
  requestId: string;
};

export default function RejectButton({ button, requestId }: RejectButtonProps) {
  const onClick = async (e: React.MouseEvent) => {
    e.stopPropagation();

    const res = await rejectRequest(requestId);

    if (!res.success) alert('Failed to reject request');
  };

  if (button) {
    return (
      <span
        onClick={(e) => onClick(e)}
        onMouseDown={(e) => e.stopPropagation()}
      >
        {button}
      </span>
    );
  }

  return (
    <IconButton
      aria-label="reject"
      color="error"
      onClick={(e) => e.stopPropagation()}
      onMouseDown={(e) => e.stopPropagation()}
    >
      <Clear />
    </IconButton>
  );
}
