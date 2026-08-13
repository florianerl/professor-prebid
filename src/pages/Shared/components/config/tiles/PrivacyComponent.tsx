import React, { useEffect, useContext, useState } from 'react';
import BusinessIcon from '@mui/icons-material/Business';
import CodeIcon from '@mui/icons-material/Code';
import Grid from '@mui/material/Grid';
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';

import AppStateContext from '../../../contexts/appStateContext';
import RenderKeyValueComponent from '../../RenderKeyValueComponent';
import { ExpandableTile } from './ExpandableTile';
import JSONViewerComponent from '../../JSONViewerComponent';
import { TCString } from '@iabtcf/core';

const PrivacyComponent = (): JSX.Element | null => {
  const { prebid, tcf } = useContext(AppStateContext);
  const [showJson, setShowJson] = useState(false);

  const { consentManagement } = prebid?.config || {};
  if (!consentManagement) return null;

  const { gdpr, usp } = consentManagement;
  const { cmpApi, defaultGdprScope, timeout } = gdpr || {};

  const jsonToggleAction = (
    <Tooltip title={showJson ? 'Switch to formatted view' : 'Switch to raw JSON view'} arrow>
      <IconButton size="small" onClick={() => setShowJson(!showJson)} color={showJson ? 'primary' : 'default'} sx={{ mr: 0.5 }}>
        <CodeIcon fontSize="small" />
      </IconButton>
    </Tooltip>
  );

  return (
    <ExpandableTile
      icon={<BusinessIcon />}
      title="Consent Management"
      subtitle="TCF, CPA, USP, …"
      defaultMaxWidth={4}
      expandedMaxWidth={8}
      headerAction={jsonToggleAction}
    >
      {showJson ? (
        <Grid size={{ xs: 12 }}>
          <JSONViewerComponent src={{ consentManagement, tcf }} name="" collapsed={1} />
        </Grid>
      ) : (
        <>
          <RenderKeyValueComponent label="CMP API" value={cmpApi} columns={[4, 12]} expanded />
          <RenderKeyValueComponent label="Timeout" value={timeout ? `${timeout}ms` : undefined} columns={[4, 12]} expanded />
          <RenderKeyValueComponent label="Default GDPR Scope" value={defaultGdprScope} columns={[4, 12]} expanded />
          {gdpr?.rules?.map((rule: any, index: number) => (
            <RenderKeyValueComponent key={`rule-${index}`} label={`Rule #${index + 1}`} value={rule} columns={[4, 12]} expanded />
          ))}
          {tcf && Object.keys(tcf).map((key) => <TcfComponent key={key} tcf={tcf} tcfKey={key} />)}
        </>
      )}
    </ExpandableTile>
  );
};

const TcfComponent = ({ tcf, tcfKey }: { tcf: any; tcfKey: string }): JSX.Element => {
  const [decoded, setDecoded] = React.useState({});
  useEffect(() => {
    try {
      setDecoded(TCString.decode(tcf[tcfKey]?.consentData || '', null));
    } catch {}
  }, [tcf, tcfKey]);

  return (
    <>
      <RenderKeyValueComponent label="TCF Version" value={tcfKey} columns={[4, 12]} expanded />
      <RenderKeyValueComponent label="Consent Data" value={tcf[tcfKey]?.consentData || 'no consent string'} columns={[4, 12]} expanded />
      <RenderKeyValueComponent label="Decoded Consent String" value={decoded} columns={[4, 12]} expanded />
    </>
  );
};

export default PrivacyComponent;
