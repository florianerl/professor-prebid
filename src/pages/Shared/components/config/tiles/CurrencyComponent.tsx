import React, { useContext, useState } from 'react';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import CodeIcon from '@mui/icons-material/Code';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';

import AppStateContext from '../../../contexts/appStateContext';
import { ExpandableTile } from './ExpandableTile';
import JSONViewerComponent from '../../JSONViewerComponent';

const CurrencyComponent = (): JSX.Element | null => {
  const { prebid } = useContext(AppStateContext);
  const [showJson, setShowJson] = useState(false);
  const currency = prebid?.config?.currency;

  if (!currency || (typeof currency === 'object' && Object.keys(currency).length === 0)) {
    return null;
  }

  const jsonToggleAction = (
    <Tooltip title={showJson ? 'Switch to formatted view' : 'Switch to raw JSON view'} arrow>
      <IconButton size="small" onClick={() => setShowJson(!showJson)} color={showJson ? 'primary' : 'default'} sx={{ mr: 0.5 }}>
        <CodeIcon fontSize="small" />
      </IconButton>
    </Tooltip>
  );

  return (
    <ExpandableTile
      icon={<AttachMoneyIcon />}
      title="Currency"
      subtitle={typeof currency === 'object' && currency.adServerCurrency ? `Ad Server: ${currency.adServerCurrency}` : 'Currency conversion active'}
      defaultMaxWidth={4}
      expandedMaxWidth={8}
      headerAction={jsonToggleAction}
    >
      {showJson ? (
        <Grid size={{ xs: 12 }}>
          <JSONViewerComponent src={typeof currency === 'object' ? currency : { currency }} name="" collapsed={1} />
        </Grid>
      ) : typeof currency === 'string' ? (
        <Grid size={{ xs: 12 }}>
          <Typography variant="body1">
            <strong>Ad Server Currency: </strong> {currency}
          </Typography>
        </Grid>
      ) : (
        <Grid size={{ xs: 12 }}>
          {Object.entries(currency).map(([k, v]) => (
            <Typography key={k} variant="body1">
              <strong>{k}: </strong> {typeof v === 'object' ? JSON.stringify(v) : String(v)}
            </Typography>
          ))}
        </Grid>
      )}
    </ExpandableTile>
  );
};

export default CurrencyComponent;
