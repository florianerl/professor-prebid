import React from 'react';
import Box from '@mui/material/Box';

interface OptionsLayoutProps {
  children: React.ReactNode;
}

export const OptionsLayout: React.FC<OptionsLayoutProps> = ({ children }) => (
  <Box
    sx={{
      backgroundColor: 'primary.light',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'flex-start',
      height: '100vh',
      p: 1,
    }}
  >
    {children}
  </Box>
);

export default OptionsLayout;
