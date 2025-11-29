import { Check } from '@mui/icons-material';
import { IconButton } from '@mui/material';

type ApproveButtonProps = {
  button?: React.ReactNode;
  requestId: number;
};

export default function ApproveButton({
  button,
  requestId,
}: ApproveButtonProps) {
  const onClick = (e: React.MouseEvent) => {
    e.stopPropagation();
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
