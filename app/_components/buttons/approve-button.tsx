import { approveRequest } from '@/app/api/_client/approval.client';
import { Check } from '@mui/icons-material';
import { IconButton } from '@mui/material';

type ApproveButtonProps = {
  button?: React.ReactNode;
  requestId: string;
};

export default function ApproveButton({
  button,
  requestId,
}: ApproveButtonProps) {
  const onClick = async (e: React.MouseEvent) => {
    e.stopPropagation();

    const res = await approveRequest(requestId);

    if (!res.success) alert('Failed to approve request');
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
      aria-label="approve"
      color="success"
      onClick={(e) => onClick(e)}
      onMouseDown={(e) => e.stopPropagation()}
    >
      <Check />
    </IconButton>
  );
}
