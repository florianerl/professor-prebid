import React, { useEffect, useContext } from 'react';
import { sendChromeTabsMessage } from '../Shared/utils';
import { PBJS_NAMESPACE_CHANGE, POPUP_LOADED } from '../Shared/constants';
import AppStateContext from '../Shared/contexts/appStateContext';
import NoPrebidCardComponent from '../Shared/components/NoPrebidCardComponent';
import RoutesComponent from '../Shared/components/RoutesComponent';
import NavLayout from '../Shared/layouts/NavLayout';

export const Popup = (): JSX.Element => {
  const { pbjsNamespace, prebids } = useContext(AppStateContext);

  useEffect(() => {
    sendChromeTabsMessage(PBJS_NAMESPACE_CHANGE, pbjsNamespace);
  }, [pbjsNamespace]);

  useEffect(() => {
    // console.log('popup POPUP_LOADED', );
    sendChromeTabsMessage(POPUP_LOADED, {});
  }, []);

  return (
    <NavLayout sx={{ height: 600, overflowX: 'auto' }}>
      {(!prebids || !prebids[pbjsNamespace]) && <NoPrebidCardComponent />}
      {prebids && prebids[pbjsNamespace] && <RoutesComponent />}
    </NavLayout>
  );
};
