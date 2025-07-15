import React from 'react';
import Box from '@mui/material/Box';
import { BrowserRouter } from 'react-router-dom';
import { NavBar } from '../components/navBar/Navbar';
import { SxProps, Theme } from '@mui/material/styles';

interface NavLayoutProps {
  children: React.ReactNode;
  sx?: SxProps<Theme>;
}

export const NavLayout: React.FC<NavLayoutProps> = ({ children, sx }) => (
  <BrowserRouter>
    <Box sx={{ backgroundColor: 'primary.light', minHeight: '100vh', height: '100%', ...sx }}>
      <NavBar />
      {children}
    </Box>
  </BrowserRouter>
);

export default NavLayout;
