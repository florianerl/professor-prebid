import React from 'react';
import { ThemeProvider } from '@mui/material/styles';
import { theme } from '../../../theme/theme';
import { OptionsContextProvider } from '../contexts/optionsContext';
import { InspectedPageContextProvider } from '../contexts/inspectedPageContext';
import { StateContextProvider } from '../contexts/appStateContext';
import { ErrorBoundary } from 'react-error-boundary';
import ErrorCardComponent from '../components/ErrorCardComponent';

interface AppLayoutProps {
  children: React.ReactNode;
}

const AppLayout: React.FC<AppLayoutProps> = ({ children }) => (
  <ThemeProvider theme={theme}>
    <OptionsContextProvider>
      <InspectedPageContextProvider>
        <StateContextProvider>
          <ErrorBoundary FallbackComponent={ErrorCardComponent}>{children}</ErrorBoundary>
        </StateContextProvider>
      </InspectedPageContextProvider>
    </OptionsContextProvider>
  </ThemeProvider>
);

export default AppLayout;
