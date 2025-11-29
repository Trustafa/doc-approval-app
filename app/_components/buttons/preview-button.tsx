import { FindInPage } from '@mui/icons-material';
import { IconButton } from '@mui/material';

type PreviewButtonProps = {
  button?: React.ReactNode;
  requestId: number;
};

export default function PreviewButton({
  button,
  requestId,
}: PreviewButtonProps) {
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
      aria-label="preview"
      onClick={(e) => e.stopPropagation()}
      onMouseDown={(e) => e.stopPropagation()}
    >
      <FindInPage />
    </IconButton>
  );
}
