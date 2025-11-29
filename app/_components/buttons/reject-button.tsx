import { Clear } from '@mui/icons-material';
import { IconButton } from '@mui/material';

type RejectButtonProps = {
  button?: React.ReactNode;
  requestId: number;
};

export default function RejectButton({ button, requestId }: RejectButtonProps) {
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
      aria-label="reject"
      color="error"
      onClick={(e) => e.stopPropagation()}
      onMouseDown={(e) => e.stopPropagation()}
    >
      <Clear />
    </IconButton>
  );
}
