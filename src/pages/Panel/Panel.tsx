import React, { useContext, useEffect } from 'react';
import RoutesComponent from '../Shared/components/RoutesComponent';
import NavLayout from '../Shared/layouts/NavLayout';
import InspectedPageContext from '../Shared/contexts/inspectedPageContext';
import StateContext from '../Shared/contexts/appStateContext';
import { PBJS_NAMESPACE_CHANGE } from '../Shared/constants';
import { sendChromeTabsMessage } from '../Shared/utils';
import DownloadingCardComponent from '../Shared/components/DownloadingCardComponent';
import NoPrebidCardComponent from '../Shared/components/NoPrebidCardComponent';

const Panel = (): JSX.Element => {
  const { pbjsNamespace, prebids } = useContext(StateContext);
  const { downloading } = useContext(InspectedPageContext);
  const [showDownloadCard, setShowDownloadCard] = React.useState(false);

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    // set showDownloadCard to true when downloading is true for more than 1 second
    if (downloading === 'true' || downloading === 'error') {
      timeout = setTimeout(() => {
        setShowDownloadCard(true);
      }, 1000);
    } else {
      setShowDownloadCard(false);
    }
    return () => {
      clearTimeout(timeout);
    };
  }, [downloading]);

  useEffect(() => {
    sendChromeTabsMessage(PBJS_NAMESPACE_CHANGE, pbjsNamespace);
  }, [pbjsNamespace]);

  return (
    <NavLayout>
      {(!prebids || !prebids[pbjsNamespace]) && downloading === 'false' && <NoPrebidCardComponent />}
      {showDownloadCard && <DownloadingCardComponent />}
      {prebids && prebids[pbjsNamespace] && !showDownloadCard && <RoutesComponent />}
    </NavLayout>
  );
};

export default Panel;
