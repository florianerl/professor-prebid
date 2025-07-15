import React from 'react';
import Box from '@mui/material/Box';
import { SxProps, Theme } from '@mui/material/styles';

interface SimpleLayoutProps {
  children: React.ReactNode;
  sx?: SxProps<Theme>;
}

export const SimpleLayout: React.FC<SimpleLayoutProps> = ({ children, sx }) => <Box sx={{ backgroundColor: 'primary.light', ...sx }}>{children}</Box>;

export default SimpleLayout;
