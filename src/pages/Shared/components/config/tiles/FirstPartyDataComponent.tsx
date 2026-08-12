import React, { useContext, useState } from 'react';
import DataObjectOutlinedIcon from '@mui/icons-material/DataObjectOutlined';
import CodeIcon from '@mui/icons-material/Code';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';

import AppStateContext from '../../../contexts/appStateContext';
import { ExpandableTile } from './ExpandableTile';
import JSONViewerComponent from '../../JSONViewerComponent';

const FirstPartyDataComponent = (): JSX.Element | null => {
  const { prebid } = useContext(AppStateContext);
  const [showJson, setShowJson] = useState(false);
  const rawOrtb2 = prebid?.config?.ortb2;

  if (!rawOrtb2 || (typeof rawOrtb2 === 'object' && Object.keys(rawOrtb2).length === 0)) {
    return null;
  }

  const ortb2 = rawOrtb2 as Record<string, any>;
  const site = (ortb2.site || {}) as Record<string, any>;
  const user = (ortb2.user || {}) as Record<string, any>;

  const jsonToggleAction = (
    <Tooltip title={showJson ? 'Switch to formatted view' : 'Switch to raw JSON view'} arrow>
      <IconButton size="small" onClick={() => setShowJson(!showJson)} color={showJson ? 'primary' : 'default'} sx={{ mr: 0.5 }}>
        <CodeIcon fontSize="small" />
      </IconButton>
    </Tooltip>
  );

  return (
    <ExpandableTile
      icon={<DataObjectOutlinedIcon />}
      title="First Party Data (ortb2)"
      subtitle="OpenRTB2 publisher & site data"
      defaultMaxWidth={4}
      expandedMaxWidth={8}
      headerAction={jsonToggleAction}
    >
      {showJson ? (
        <Grid size={{ xs: 12 }}>
          <JSONViewerComponent src={ortb2} name="" collapsed={1} />
        </Grid>
      ) : (
        <Grid size={{ xs: 12 }}>
          {site.domain && (
            <Typography variant="body2" sx={{ fontSize: '0.75rem', mb: 0.25 }}>
              <strong>Site Domain:</strong> {site.domain}
            </Typography>
          )}
          {site.publisher?.id && (
            <Typography variant="body2" sx={{ fontSize: '0.75rem', mb: 0.25 }}>
              <strong>Publisher ID:</strong> {site.publisher.id}
            </Typography>
          )}
          {site.cat && Array.isArray(site.cat) && (
            <Typography variant="body2" sx={{ fontSize: '0.75rem', mb: 0.25 }}>
              <strong>Categories:</strong> {site.cat.join(', ')}
            </Typography>
          )}
          {user.gender && (
            <Typography variant="body2" sx={{ fontSize: '0.75rem', mb: 0.25 }}>
              <strong>User Gender:</strong> {user.gender}
            </Typography>
          )}
          {user.yob && (
            <Typography variant="body2" sx={{ fontSize: '0.75rem', mb: 0.25 }}>
              <strong>User YOB:</strong> {user.yob}
            </Typography>
          )}
          {!site.domain && !site.publisher?.id && !user.gender && (
            <Typography variant="body2" sx={{ fontSize: '0.75rem', color: 'text.secondary' }}>
              {Object.keys(ortb2).length} top-level ortb2 key(s) configured.
            </Typography>
          )}
        </Grid>
      )}
    </ExpandableTile>
  );
};

export default FirstPartyDataComponent;
