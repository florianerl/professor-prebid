import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import { alpha } from '@mui/material/styles';
import Grid from '@mui/material/Grid';
import { theme } from '../../../theme/theme';
import { ThemeProvider } from '@mui/material';
import GamDetailsComponent from './GamDetailsComponent';

import PopOverComponent from './PopOverComponent';
import { CacheProvider } from '@emotion/react';
import createCache from '@emotion/cache';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Close from '@mui/icons-material/Close';
import Refresh from '@mui/icons-material/Refresh';
import MinimizeIcon from '@mui/icons-material/Minimize';
import MaximizeIcon from '@mui/icons-material/Maximize';
import OpenInFullIcon from '@mui/icons-material/OpenInFull';

const AdOverlayComponent = ({ elementId, winningCPM, winningBidder, currency, timeToRespond, closePortal, shadowRoot, pbjsNameSpace }: AdOverlayComponentProps): JSX.Element => {
  const gridRef = React.useRef<HTMLDivElement>(null);
  const boxRef = React.useRef<HTMLDivElement>(null);
  const [truncate, setTruncate] = useState<boolean>(false);
  const [expanded, setExpanded] = useState<boolean>(false);
  const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null);
  const [slot, setSlot] = React.useState<googletag.Slot>(null);
  const cache = React.useMemo(() => createCache({ key: 'css', container: shadowRoot || document.head, prepend: true }), [shadowRoot]);
  const openInPopOver = () => {
    let bodyContainer = window.document.body;
    try {
      if (window.top && window.top.document) {
        bodyContainer = window.top.document.body;
      }
    } catch (e) {}
    setAnchorEl(bodyContainer);
  };
  useEffect(() => {
    if (window.parent.googletag && typeof window.parent.googletag?.pubads === 'function') {
      const pubads = googletag.pubads();
      const slots = pubads.getSlots();
      const slot = slots.find((slot) => slot.getSlotElementId() === elementId);
      if (slot) {
        setSlot(slot);
      }
    }
  }, [elementId]);
  useEffect(() => {
    if (!truncate) {
      setTruncate(gridRef.current?.offsetHeight > boxRef.current?.offsetHeight || false);
    }
  }, [gridRef.current?.offsetHeight, boxRef.current?.offsetHeight, truncate]);
  return (
    <ThemeProvider theme={theme}>
      <PopOverComponent elementId={elementId} winningCPM={winningCPM} winningBidder={winningBidder} currency={currency} timeToRespond={timeToRespond} closePortal={closePortal} anchorEl={anchorEl} setAnchorEl={setAnchorEl} pbjsNameSpace={pbjsNameSpace} />
      <CacheProvider value={cache}>
        <Box
          ref={boxRef}
          sx={{
            height: expanded ? '100%' : 'auto',
            width: '100%',
            maxWidth: '100%',
            backgroundColor: (theme) => alpha(theme.palette.primary.light, expanded ? 0.9 : 0.95),
            color: 'text.primary',
            padding: 0.75,
            boxSizing: 'border-box',
            border: '1px solid',
            borderBottom: expanded ? '1px solid' : 'none',
            borderColor: (theme) => alpha(theme.palette.primary.main, 0.3),
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            position: 'absolute',
            top: 0,
            left: 0,
            zIndex: 999999,
            pointerEvents: 'auto',
            transition: 'background-color 0.2s',
          }}
        >
          <Grid container alignItems="flex-start" ref={gridRef} sx={{ flexWrap: 'nowrap' }}>
            <Grid container justifyContent="space-between" alignItems="center" sx={{ width: '100%', flexWrap: 'nowrap' }}>
              <Grid sx={{ display: 'flex', alignItems: 'center', overflow: 'hidden' }}>
                <Typography variant="body2" sx={{ fontWeight: 700, color: 'primary.main', whiteSpace: 'nowrap' }}>
                  {elementId}
                </Typography>
              </Grid>
              <Grid
                sx={{
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'flex-end',
                  alignItems: 'center',
                  color: 'text.secondary',
                  flexShrink: 0,
                }}
              >
                <IconButton sx={{ p: 0.25 }} onClick={() => setExpanded(!expanded)}>
                  {expanded ? <MinimizeIcon sx={{ fontSize: 16 }} /> : <MaximizeIcon sx={{ fontSize: 16 }} />}
                </IconButton>

                <IconButton sx={{ p: 0.25 }} onClick={openInPopOver}>
                  <OpenInFullIcon sx={{ fontSize: 16 }} />
                </IconButton>

                {window.parent.googletag && typeof window.parent.googletag?.pubads === 'function' && (
                  <IconButton
                    sx={{ p: 0.25 }}
                    onClick={() => {
                      window.parent.googletag.pubads().refresh([slot]);
                    }}
                  >
                    <Refresh sx={{ fontSize: 16 }} />
                  </IconButton>
                )}

                <IconButton sx={{ p: 0.25 }} onClick={closePortal}>
                  <Close sx={{ fontSize: 16 }} />
                </IconButton>
              </Grid>
            </Grid>
          </Grid>

          {expanded && (currency || winningBidder || winningCPM || timeToRespond || elementId) && (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 1, width: '100%' }}>
              {winningCPM && (
                <Box sx={{ p: 0.5, borderRadius: 1, backgroundColor: 'rgba(255,255,255,0.5)', border: '1px solid', borderColor: 'primary.light' }}>
                  <Typography variant="caption" sx={{ color: 'text.primary' }}>
                    <strong style={{ color: '#f99b0c' }}>CPM: </strong>
                    {winningCPM} {currency}
                  </Typography>
                </Box>
              )}
              {winningBidder && (
                <Box sx={{ p: 0.5, borderRadius: 1, backgroundColor: 'rgba(255,255,255,0.5)', border: '1px solid', borderColor: 'primary.light' }}>
                  <Typography variant="caption" sx={{ color: 'text.primary' }}>
                    <strong style={{ color: '#f99b0c' }}>Bidder: </strong>
                    {winningBidder}
                  </Typography>
                </Box>
              )}
              {timeToRespond && (
                <Box sx={{ p: 0.5, borderRadius: 1, backgroundColor: 'rgba(255,255,255,0.5)', border: '1px solid', borderColor: 'primary.light' }}>
                  <Typography variant="caption" sx={{ color: 'text.primary' }}>
                    <strong style={{ color: '#f99b0c' }}>TTR: </strong>
                    {timeToRespond}ms
                  </Typography>
                </Box>
              )}
              {elementId && <GamDetailsComponent elementId={elementId} inPopOver={false} truncate={truncate} />}
            </Box>
          )}
        </Box>
      </CacheProvider>
    </ThemeProvider>
  );
};

export interface AdOverlayComponentProps {
  elementId: string;
  winningBidder: string;
  winningCPM: number;
  currency: string;
  timeToRespond: number;
  closePortal?: () => void;
  shadowRoot?: ShadowRoot | null;
  pbjsNameSpace?: string;
}

export default AdOverlayComponent;
