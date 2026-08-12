import React, { useEffect, useState, useContext, useMemo } from 'react';
import Grid from '@mui/material/Grid';
import { Paper, Tooltip, IconButton } from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import { ErrorBoundary } from 'react-error-boundary';

import AppStateContext from '../../contexts/appStateContext';
import JSONViewerComponent from '../JSONViewerComponent';
import { GridCell } from '../bids/BidsComponent';
import { AutoComplete } from '../autocomplete/AutoComplete';
import { replaceLastToken } from '../autocomplete/utils';
import { download } from '../../utils';

import PriceGranularityComponent from './tiles/PriceGranularityComponent';
import UserIdModule from './tiles/UserIdModule';
import PrebidServerComponent from './tiles/PrebidServerComponent';
import PrivacyComponent from './tiles/PrivacyComponent';
import BidderSettingsComponent from './tiles/BidderSettingsComponent';
import PrebidConfigComponent from '../../../Popup/components/config/PrebidConfigComponent';
import FloorsModuleComponent from './tiles/FloorsModuleComponent';
import GptPreAuctionComponent from './tiles/GptPreAuctionComponent';
import InstalledModulesComponent from './tiles/InstalledModules';
import UserSyncComponent from './tiles/UserSyncComponent';
import AnalyticsComponent from './tiles/AnalyticsComponent';
import FirstPartyDataComponent from './tiles/FirstPartyDataComponent';
import CurrencyComponent from './tiles/CurrencyComponent';
import RtdComponent from './tiles/RtdComponent';
import OtherConfigsComponent from './tiles/OtherConfigsComponent';

export const tileHeight = 255;

const ConfigComponent = (): JSX.Element => {
  const { prebid } = useContext(AppStateContext);
  const [query, setQuery] = useState('');

  const tiles = [
    InstalledModulesComponent,
    PriceGranularityComponent,
    PrebidConfigComponent,
    BidderSettingsComponent,
    PrebidServerComponent,
    PrivacyComponent,
    UserIdModule,
    FloorsModuleComponent,
    GptPreAuctionComponent,
    UserSyncComponent,
    AnalyticsComponent,
    FirstPartyDataComponent,
    CurrencyComponent,
    RtdComponent,
    OtherConfigsComponent,
  ];

  const fullConfig = (prebid?.config || {}) as Record<string, any>;
  const fieldKeys = useMemo(() => Object.keys(fullConfig), [fullConfig]);

  const filteredConfig = useMemo(() => {
    if (!query.trim()) return {};
    const q = query.toLowerCase().trim();
    const result: Record<string, any> = {};

    Object.keys(fullConfig).forEach((key) => {
      const val = fullConfig[key];
      const matchKey = key.toLowerCase().includes(q);
      const matchVal = typeof val === 'object' ? JSON.stringify(val).toLowerCase().includes(q) : String(val).toLowerCase().includes(q);

      if (matchKey || matchVal) {
        result[key] = val;
      }
    });

    return result;
  }, [fullConfig, query]);

  return (
    <Grid container alignItems="flex-start">
      {/* Header Bar: Full-width search bar + download button */}
      <Grid size={{ xs: 11.5 }} sx={{ display: 'flex', alignItems: 'center', border: 0, '& .MuiInputBase-input': { paddingLeft: '4px !important', paddingTop: '4px !important' } }}>
        <AutoComplete
          query={query}
          fieldKeys={fieldKeys}
          onPick={(opt) => setQuery((cur) => replaceLastToken(cur, opt))}
          onQueryChange={setQuery}
          placeholder="Filter config..."
        />
      </Grid>

      <GridCell cols={0.5} sx={{ display: 'flex', alignItems: 'center', border: 0 }}>
        <Tooltip title="Download Prebid config as JSON" arrow>
          <IconButton size="small" onClick={() => download(fullConfig, 'prebid-config')} sx={{ p: 0.5, fontSize: '1.05rem', height: 'auto' }}>
            <DownloadIcon fontSize="inherit" />
          </IconButton>
        </Tooltip>
      </GridCell>

      {/* Content View Switcher */}
      {query.trim() !== '' ? (
        <Grid size={{ xs: 12 }}>
          <Paper sx={{ p: 1, mt: 0.5 }}>
            {Object.keys(filteredConfig).length > 0 ? (
              <JSONViewerComponent src={filteredConfig} name="config" collapsed={false} />
            ) : (
              <Paper sx={{ p: 2, textAlign: 'center' }}>No matching configuration parameters</Paper>
            )}
          </Paper>
        </Grid>
      ) : (
        <Grid size={{ xs: 12 }} sx={{ columnCount: { xs: 1, sm: 2, md: 3 }, columnGap: '4px', '& > *': { width: '100% !important', maxWidth: '100% !important' } }}>
          {tiles.map((Tile, index) => (
            <ErrorBoundary key={index} FallbackComponent={ErrorFallback}>
              <Tile />
            </ErrorBoundary>
          ))}
        </Grid>
      )}
    </Grid>
  );
};

export default ConfigComponent;

const ErrorFallback: React.FC<{ error: Error; resetErrorBoundary: () => void }> = ({ error, resetErrorBoundary }) => {
  const [delayElapsed, setDelayElapsed] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      resetErrorBoundary();
      setDelayElapsed(true);
    }, 1000);
    return () => clearTimeout(timer);
  }, [resetErrorBoundary]);

  return (
    <div style={{ padding: '8px', color: 'red' }}>
      <p>An error occurred: {error.message}</p>
      {delayElapsed && <p>Resetting...</p>}
    </div>
  );
};
