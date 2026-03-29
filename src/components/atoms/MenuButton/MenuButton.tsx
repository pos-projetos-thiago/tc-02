'use client';

import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';

export interface MenuButtonProps {
  onClick?: () => void;
}

export const MenuButton = ({ onClick }: MenuButtonProps) => {
  return (
    <IconButton
      onClick={onClick}
      aria-label="Menu"
      size="large"
      sx={{
        color: '#47A138',
        '&:hover': {
          opacity: 0.7,
          backgroundColor: 'transparent'
        }
      }}
    >
      <MenuIcon sx={{ fontSize: 32 }} />
    </IconButton>
  );
};
