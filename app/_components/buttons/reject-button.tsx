import { Clear } from '@mui/icons-material';
import { IconButton } from '@mui/material';

type RejectButtonProps = {
  button?: React.ReactNode;
  onClick: () => void;
};

export default function RejectButton({ button, onClick }: RejectButtonProps) {
  if (button) {
    return (
      <span
        onClick={(e) => {
          e.stopPropagation();
          onClick();
        }}
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
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      onMouseDown={(e) => e.stopPropagation()}
    >
      <Clear />
    </IconButton>
  );
}
