import { Check } from '@mui/icons-material';
import { IconButton } from '@mui/material';

type ApproveButtonProps = {
  button?: React.ReactNode;
  onClick: () => void;
};

export default function ApproveButton({ button, onClick }: ApproveButtonProps) {
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
      aria-label="approve"
      color="success"
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      onMouseDown={(e) => e.stopPropagation()}
    >
      <Check />
    </IconButton>
  );
}
