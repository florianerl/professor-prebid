import React, { useEffect, useContext } from 'react';
import { sendChromeTabsMessage } from '../Shared/utils';
import { MESSAGE_TYPE } from '../Shared/constants';
import Box from '@mui/material/Box';
import { BrowserRouter } from 'react-router-dom';
import AppStateContext from '../Shared/contexts/appStateContext';
import NoPrebidCardComponent from '../Shared/components/NoPrebidCardComponent';
import RoutesComponent from '../Shared/components/RoutesComponent';
import { NavBar } from '../Shared/components/navBar/Navbar';

export const Popup = (): JSX.Element => {
  const { pbjsNamespace, prebids } = useContext(AppStateContext);

  useEffect(() => {
    sendChromeTabsMessage(MESSAGE_TYPE.PBJS_NAMESPACE_CHANGE, pbjsNamespace);
  }, [pbjsNamespace]);

  useEffect(() => {
    // console.log('popup POPUP_LOADED', );  
    sendChromeTabsMessage(MESSAGE_TYPE.POPUP_LOADED, {});
  }, []);

  return (
    <BrowserRouter>
      <Box sx={{ height: 600, overflowX: 'auto', backgroundColor: 'primary.light' }}>
        <NavBar />
        {(!prebids || !prebids[pbjsNamespace]) && <NoPrebidCardComponent />}
        {prebids && prebids[pbjsNamespace] && <RoutesComponent />}
      </Box>
    </BrowserRouter>
  );
};
