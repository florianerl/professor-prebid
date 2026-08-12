import React, { useContext } from 'react';
import Typography from '@mui/material/Typography';
import SettingsApplicationsIcon from '@mui/icons-material/SettingsApplications';
import Grid from '@mui/material/Grid';
import AppStateContext from '../../../Shared/contexts/appStateContext';
import { ExpandableTile } from '../../../Shared/components/config/tiles/ExpandableTile';

const PrebidConfigComponent = (): JSX.Element => {
  const { prebid } = useContext(AppStateContext);
  const { config } = prebid;

  if (!config) return null;

  return (
    <ExpandableTile
      icon={<SettingsApplicationsIcon />}
      title="Prebid Config"
      subtitle="Timeouts, cache, & core settings"
      defaultMaxWidth={4}
      expandedMaxWidth={8}
    >
      <Grid size={{ xs: 12, sm: 6 }}>
        <Typography variant="body1">
          <strong>Bidder Sequence: </strong>
          {config.bidderSequence || 'random'}
        </Typography>
      </Grid>
      <Grid size={{ xs: 12, sm: 6 }}>
        <Typography variant="body1">
          <strong>Bidder Timeout: </strong>
          {config.bidderTimeout ? `${config.bidderTimeout}ms` : '3000ms'}
        </Typography>
      </Grid>
      <Grid size={{ xs: 12, sm: 6 }}>
        <Typography variant="body1">
          <strong>Send All Bids: </strong>
          {config.enableSendAllBids !== undefined ? String(config.enableSendAllBids) : 'true'}
        </Typography>
      </Grid>
      <Grid size={{ xs: 12, sm: 6 }}>
        <Typography variant="body1">
          <strong>Max Nested Iframes: </strong>
          {config.maxNestedIframes ?? 10}
        </Typography>
      </Grid>
      <Grid size={{ xs: 12, sm: 6 }}>
        <Typography variant="body1">
          <strong>Use Bid Cache: </strong>
          {String(config.useBidCache ?? false)}
        </Typography>
      </Grid>
      {config.cache?.url && (
        <Grid size={{ xs: 12, sm: 6 }}>
          <Typography variant="body1" sx={{ wordBreak: 'break-word' }}>
            <strong>Bid Cache Url: </strong>
            {config.cache.url}
          </Typography>
        </Grid>
      )}
      {config.deviceAccess !== undefined && (
        <Grid size={{ xs: 12, sm: 6 }}>
          <Typography variant="body1">
            <strong>Device Access: </strong>
            {String(config.deviceAccess)}
          </Typography>
        </Grid>
      )}
    </ExpandableTile>
  );
};

export default PrebidConfigComponent;
