import React, { useContext, useState } from 'react';
import PeopleOutlinedIcon from '@mui/icons-material/PeopleOutlined';
import CodeIcon from '@mui/icons-material/Code';
import Chip from '@mui/material/Chip';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';

import AppStateContext from '../../../contexts/appStateContext';
import { ExpandableTile } from './ExpandableTile';
import JSONViewerComponent from '../../JSONViewerComponent';

const UserSyncComponent = (): JSX.Element | null => {
  const { prebid } = useContext(AppStateContext);
  const { config } = prebid;
  const [showJson, setShowJson] = useState(false);

  if (!config?.userSync) return null;
  const userSync = config.userSync as Record<string, any>;

  const {
    syncEnabled,
    iframeEnabled,
    pixelEnabled,
    aliasSyncEnabled,
    auctionDelay,
    syncDelay,
    syncsPerBidder,
    filterSettings,
  } = userSync;

  const activeSyncTypes = [
    { label: 'iframe', enabled: iframeEnabled },
    { label: 'pixel', enabled: pixelEnabled },
    { label: 'aliasSync', enabled: aliasSyncEnabled },
    { label: 'syncEnabled', enabled: syncEnabled },
  ].filter((item) => item.enabled !== undefined);

  const filterRules = (filterSettings || {}) as Record<string, any>;
  const filterKeys = Object.keys(filterRules);

  const jsonToggleAction = (
    <Tooltip title={showJson ? 'Switch to formatted view' : 'Switch to raw JSON view'} arrow>
      <IconButton size="small" onClick={() => setShowJson(!showJson)} color={showJson ? 'primary' : 'default'} sx={{ mr: 0.5 }}>
        <CodeIcon fontSize="small" />
      </IconButton>
    </Tooltip>
  );

  return (
    <ExpandableTile
      icon={<PeopleOutlinedIcon />}
      title="User Sync"
      subtitle={syncEnabled === false ? 'Syncing disabled' : 'User sync rules'}
      defaultMaxWidth={4}
      expandedMaxWidth={8}
      headerAction={jsonToggleAction}
    >
      {showJson ? (
        <Grid size={{ xs: 12 }}>
          <JSONViewerComponent src={userSync} name="" collapsed={1} />
        </Grid>
      ) : (
        <>
          {/* Sync Modes / Chips */}
          <Grid size={{ xs: 12 }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 0.5, color: 'text.secondary', fontSize: '0.75rem' }}>
              Sync Modes
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 1 }}>
              {activeSyncTypes.map((item) => (
                <Chip
                  key={item.label}
                  label={`${item.label}: ${item.enabled ? 'enabled' : 'disabled'}`}
                  size="small"
                  color={item.enabled ? 'success' : 'default'}
                  variant={item.enabled ? 'filled' : 'outlined'}
                  sx={{ height: 22, fontSize: '0.7rem', fontWeight: 500 }}
                />
              ))}
            </Box>
          </Grid>

          {/* Delays & Constraints */}
          {(auctionDelay !== undefined || syncDelay !== undefined || syncsPerBidder !== undefined) && (
            <Grid size={{ xs: 12 }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 0.5, color: 'text.secondary', fontSize: '0.75rem' }}>
                Delays & Limits
              </Typography>
              <Grid container spacing={1}>
                {auctionDelay !== undefined && (
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Typography variant="body1">
                      <strong>Auction Delay: </strong> {auctionDelay}ms
                    </Typography>
                  </Grid>
                )}
                {syncDelay !== undefined && (
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Typography variant="body1">
                      <strong>Sync Delay: </strong> {syncDelay}ms
                    </Typography>
                  </Grid>
                )}
                {syncsPerBidder !== undefined && (
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Typography variant="body1">
                      <strong>Syncs / Bidder: </strong> {syncsPerBidder}
                    </Typography>
                  </Grid>
                )}
              </Grid>
            </Grid>
          )}

          {/* Filter Settings Rules */}
          {filterKeys.length > 0 && (
            <Grid size={{ xs: 12 }} sx={{ mt: 1 }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 0.5, color: 'text.secondary', fontSize: '0.75rem' }}>
                Filter Rules ({filterKeys.length})
              </Typography>
              {filterKeys.map((key) => {
                const rule = filterRules[key] || {};
                const biddersStr = Array.isArray(rule.bidders) ? rule.bidders.join(', ') : String(rule.bidders || '*');
                return (
                  <Typography key={key} variant="body2" sx={{ fontSize: '0.75rem', mb: 0.25 }}>
                    <strong>{key}:</strong> {rule.filter || 'include'} (bidders: <code>{biddersStr}</code>)
                  </Typography>
                );
              })}
            </Grid>
          )}
        </>
      )}
    </ExpandableTile>
  );
};

export default UserSyncComponent;
