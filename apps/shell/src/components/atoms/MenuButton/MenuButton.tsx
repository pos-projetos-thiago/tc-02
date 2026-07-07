'use client';

import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';

const ACCENT = '#FF5031';
const GREEN = '#47A138';

export interface MenuButtonProps {
  onClick?: () => void;
  tone?: 'default' | 'onPrimary' | 'accent';
}

export const MenuButton = ({ onClick, tone = 'default' }: MenuButtonProps) => {
  const color =
    tone === 'onPrimary' ? '#FFFFFF' : tone === 'accent' ? ACCENT : GREEN;

  return (
    <IconButton
      onClick={onClick}
      aria-label="Menu"
      size="large"
      sx={{
        color,
        '&:hover': {
          opacity: 0.7,
          backgroundColor: 'transparent',
        },
      }}
    >
      <MenuIcon sx={{ fontSize: 28 }} />
    </IconButton>
  );
};
