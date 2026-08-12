import React, { useContext, useState } from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Tooltip from '@mui/material/Tooltip';
import Grid from '@mui/material/Grid';
import Chip from '@mui/material/Chip';
import { EventRecord, BidderRequest } from 'prebid.js';

import AppStateContext from '../../../Shared/contexts/appStateContext';
import JSONViewerComponent from '../../../Shared/components/JSONViewerComponent';

export type BidderRequestWithStart = BidderRequest<string> & {
  start: number;
};

export type TimelineViewMode = 'single' | 'stacked';

interface IGanttChartProps {
  auctionEndEvent?: EventRecord<'auctionEnd'>;
  auctionEndEvents?: EventRecord<'auctionEnd'>[];
  mode?: TimelineViewMode;
  query?: string;
}

interface IBidderRowData {
  bidderCode: string;
  auctionLabel?: string;
  auctionIndex?: number;
  startMs: number;
  endMs: number;
  latencyMs: number;
  hasBid: boolean;
  isTimeout: boolean;
  cpm?: number;
  bidderRequest: any;
  bidResponseEvent?: any;
  noBidEvent?: any;
  isSectionHeader?: boolean;
  sectionTitle?: string;
  sectionDuration?: number;
}

const BidJsonDialog = ({
  open,
  onClose,
  rowData,
}: {
  open: boolean;
  onClose: () => void;
  rowData: IBidderRowData | null;
}) => {
  const { topics } = useContext(AppStateContext);
  if (!rowData || rowData.isSectionHeader) return null;

  const statusLabel = rowData.hasBid
    ? `BID ${rowData.cpm !== undefined ? `$${rowData.cpm}` : ''}`
    : rowData.isTimeout
    ? 'TIMEOUT'
    : 'NO BID';

  const statusColor = rowData.hasBid ? 'success' : rowData.isTimeout ? 'error' : 'default';

  const jsonPayload = {
    bidderCode: rowData.bidderCode,
    auctionLabel: rowData.auctionLabel,
    latencyMs: `${Math.round(rowData.latencyMs)}ms`,
    status: statusLabel,
    bidResponse: rowData.bidResponseEvent?.args || null,
    noBid: rowData.noBidEvent?.args || null,
    bidderRequest: rowData.bidderRequest || null,
    topics,
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth onClick={(e) => e.stopPropagation()}>
      <DialogTitle sx={{ m: 0, p: 1.5, display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#f5f5f5' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography variant="h6" component="span" sx={{ fontWeight: 700 }}>
            {rowData.bidderCode}
          </Typography>
          {rowData.auctionLabel && <Chip label={rowData.auctionLabel} size="small" variant="outlined" color="primary" />}
          <Chip label={statusLabel} size="small" color={statusColor as any} />
          <Chip label={`${rowData.latencyMs}ms`} size="small" variant="outlined" />
        </Box>
        <IconButton aria-label="close" onClick={onClose} size="small">
          <CloseIcon fontSize="small" />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers sx={{ p: 1.5, backgroundColor: '#fafafa' }}>
        <JSONViewerComponent src={jsonPayload} name={rowData.bidderCode} collapsed={2} displayObjectSize={false} displayDataTypes={false} />
      </DialogContent>
    </Dialog>
  );
};

const GanttChartComponent = ({ auctionEndEvent, auctionEndEvents, mode = 'single', query = '' }: IGanttChartProps): JSX.Element => {
  const { prebid } = useContext(AppStateContext);
  const { events, config } = prebid || {};
  const [activeRow, setActiveRow] = useState<IBidderRowData | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const configuredTimeout = config?.bidderTimeout || 3000;
  const targetAuctions = mode === 'single' ? (auctionEndEvent ? [auctionEndEvent] : []) : auctionEndEvents || [];

  if (!targetAuctions.length) {
    return (
      <Grid size={{ xs: 12 }} sx={{ flex: 1 }}>
        <Paper sx={{ p: 2, textAlign: 'center', height: '100%' }}>No auction events logged.</Paper>
      </Grid>
    );
  }

  const displayRows: IBidderRowData[] = [];
  let globalMaxDuration = 100;

  targetAuctions.forEach((aeEvent, aIdx) => {
    const { auctionEnd, bidderRequests, timestamp, auctionId } = aeEvent?.args || {};
    if (!bidderRequests || !bidderRequests.length) return;

    const auctionStartTimestamp = timestamp || bidderRequests[0]?.start || 0;
    const auctionEndTimestamp = auctionEnd || auctionStartTimestamp + 100;
    const auctionDuration = Math.max(10, auctionEndTimestamp - auctionStartTimestamp);
    if (auctionDuration > globalMaxDuration) globalMaxDuration = auctionDuration;

    const shortId = auctionId ? auctionId.slice(0, 8) : `A${aIdx + 1}`;
    const auctionLabel = `Auction #${aIdx + 1} (${shortId})`;

    if (mode === 'stacked') {
      displayRows.push({
        bidderCode: '',
        startMs: 0,
        endMs: 0,
        latencyMs: 0,
        hasBid: false,
        isTimeout: false,
        bidderRequest: null,
        isSectionHeader: true,
        sectionTitle: auctionLabel,
        sectionDuration: auctionDuration,
      });
    }

    const rowsForAuction: IBidderRowData[] = (bidderRequests as BidderRequestWithStart[])
      .map((bidderRequest) => {
        const bidderCode = bidderRequest.bidderCode || (bidderRequest as any).bidder || 'bidder';

        const bidResponseEvents = events?.filter(
          (e: any) =>
            (e.eventType === 'bidResponse' || e.eventType === 'bidWon') &&
            e.args?.auctionId === bidderRequest?.auctionId &&
            (e.args?.bidderCode === bidderCode || e.args?.bidder === bidderCode)
        );

        const noBidEvents = events?.filter(
          (e: any) =>
            e.eventType === 'noBid' &&
            e.args?.auctionId === bidderRequest?.auctionId &&
            (e.args?.bidderCode === bidderCode || e.args?.bidder === bidderCode)
        );

        const bidReqEvent = events?.find(
          (e: any) =>
            e.eventType === 'bidRequested' &&
            e.args?.auctionId === bidderRequest?.auctionId &&
            (e.args?.bidderCode === bidderCode || e.args?.bidder === bidderCode)
        );

        const reqStartTimestamp = bidderRequest.start || bidderRequest.startTime || (bidderRequest as any).timestamp || bidReqEvent?.args?.timestamp || auctionStartTimestamp;
        const startMs = Math.max(0, reqStartTimestamp - auctionStartTimestamp);

        let latencyMs = 0;
        let hasBid = false;
        let cpm: number | undefined;

        const firstResponse = bidResponseEvents?.[0]?.args;
        const firstNoBid = noBidEvents?.[0]?.args;

        if (firstResponse) {
          hasBid = true;
          cpm = firstResponse.cpm;
          if (typeof firstResponse.timeToRespond === 'number' && firstResponse.timeToRespond > 0) {
            latencyMs = firstResponse.timeToRespond;
          } else if (firstResponse.responseTimestamp && firstResponse.requestTimestamp) {
            latencyMs = firstResponse.responseTimestamp - firstResponse.requestTimestamp;
          } else if (firstResponse.responseTimestamp && reqStartTimestamp) {
            latencyMs = firstResponse.responseTimestamp - reqStartTimestamp;
          }
        } else if (firstNoBid) {
          if (typeof firstNoBid.timeToRespond === 'number' && firstNoBid.timeToRespond > 0) {
            latencyMs = firstNoBid.timeToRespond;
          } else if (firstNoBid.responseTimestamp && reqStartTimestamp) {
            latencyMs = firstNoBid.responseTimestamp - reqStartTimestamp;
          }
        }

        if (!latencyMs && bidderRequest.bids) {
          for (const b of bidderRequest.bids as any[]) {
            if (typeof b.timeToRespond === 'number' && b.timeToRespond > 0) {
              latencyMs = b.timeToRespond;
              if (b.cpm) {
                hasBid = true;
                cpm = b.cpm;
              }
              break;
            }
          }
        }

        if (!latencyMs) {
          latencyMs = Math.min(auctionDuration, 150);
        }

        const endMs = startMs + latencyMs;
        const isTimeout = !firstResponse && !firstNoBid && (endMs >= configuredTimeout || latencyMs >= configuredTimeout);

        return {
          bidderCode,
          auctionLabel: shortId,
          auctionIndex: aIdx + 1,
          startMs,
          endMs,
          latencyMs,
          hasBid,
          isTimeout,
          cpm,
          bidderRequest,
          bidResponseEvent: firstResponse ? bidResponseEvents?.[0] : undefined,
          noBidEvent: firstNoBid ? noBidEvents?.[0] : undefined,
        };
      })
      .filter((r) => !query || r.bidderCode.toLowerCase().includes(query.toLowerCase()))
      .sort((a, b) => a.startMs - b.startMs || b.latencyMs - a.latencyMs);

    displayRows.push(...rowsForAuction);
  });

  if (!displayRows.length) {
    return (
      <Grid size={{ xs: 12 }} sx={{ flex: 1 }}>
        <Paper sx={{ p: 2, textAlign: 'center', height: '100%' }}>No bidders matched your filter query.</Paper>
      </Grid>
    );
  }

  // Calculate timeline bounds across active bidders
  const maxActiveMs = Math.max(globalMaxDuration, ...displayRows.filter((r) => !r.isSectionHeader).map((r) => r.endMs));
  const showTimeoutLineInPlot = mode === 'single' && configuredTimeout <= maxActiveMs * 1.25;
  const maxTimeMs = showTimeoutLineInPlot ? Math.max(maxActiveMs * 1.08, configuredTimeout) : Math.ceil(maxActiveMs * 1.15 / 50) * 50;

  // SVG dimensions
  const SVG_WIDTH = 1000;
  const LABEL_WIDTH = 180;
  const RIGHT_PADDING = 30;
  const PLOT_WIDTH = SVG_WIDTH - LABEL_WIDTH - RIGHT_PADDING;
  const ROW_HEIGHT = 34;
  const HEADER_HEIGHT = 32;
  const FOOTER_HEIGHT = 24;
  const SVG_HEIGHT = HEADER_HEIGHT + displayRows.length * ROW_HEIGHT + FOOTER_HEIGHT;

  const timeToX = (timeMs: number) => LABEL_WIDTH + (Math.max(0, timeMs) / maxTimeMs) * PLOT_WIDTH;

  const tickStep = maxTimeMs <= 300 ? 50 : maxTimeMs <= 1000 ? 100 : maxTimeMs <= 2500 ? 250 : 500;
  const ticks: number[] = [];
  for (let t = 0; t <= maxTimeMs; t += tickStep) {
    ticks.push(t);
  }

  const handleRowClick = (row: IBidderRowData) => {
    if (row.isSectionHeader) return;
    setActiveRow(row);
    setDialogOpen(true);
  };

  return (
    <Grid size={{ xs: 12 }} sx={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
      <Paper sx={{ p: 1.5, pb: 2, flex: 1, display: 'flex', flexDirection: 'column', border: '1px solid', borderColor: 'divider', minHeight: 'calc(100vh - 165px)' }} elevation={0}>
        <Box sx={{ width: '100%', flex: 1, display: 'flex', flexDirection: 'column', overflowX: 'auto' }}>
          <svg viewBox={`0 0 ${SVG_WIDTH} ${SVG_HEIGHT}`} style={{ width: '100%', height: '100%', minWidth: '600px', display: 'block' }}>
            {/* Background Grid Lines & Header Ticks */}
            {ticks.map((tick) => {
              const x = timeToX(tick);
              return (
                <g key={tick}>
                  <line x1={x} y1={HEADER_HEIGHT - 4} x2={x} y2={SVG_HEIGHT - FOOTER_HEIGHT} stroke="#e0e0e0" strokeDasharray="3 3" strokeWidth="1" />
                  <text x={x} y={HEADER_HEIGHT - 10} fontSize="11" fill="#757575" textAnchor="middle" fontFamily="Roboto, sans-serif">
                    {tick}ms
                  </text>
                </g>
              );
            })}

            {/* Auction End Line (Blue) for single auction view */}
            {mode === 'single' && globalMaxDuration > 0 && (
              <g>
                <line
                  x1={timeToX(globalMaxDuration)}
                  y1={HEADER_HEIGHT - 4}
                  x2={timeToX(globalMaxDuration)}
                  y2={SVG_HEIGHT - FOOTER_HEIGHT + 2}
                  stroke="#1976d2"
                  strokeWidth="2"
                />
                <text
                  x={timeToX(globalMaxDuration)}
                  y={SVG_HEIGHT - 6}
                  fontSize="11"
                  fontWeight="bold"
                  fill="#1976d2"
                  textAnchor="middle"
                  fontFamily="Roboto, sans-serif"
                >
                  End ({globalMaxDuration}ms)
                </text>
              </g>
            )}

            {/* Timeout Line (Red) - Only if within plot range */}
            {mode === 'single' && showTimeoutLineInPlot ? (
              <g>
                <line
                  x1={timeToX(configuredTimeout)}
                  y1={HEADER_HEIGHT - 4}
                  x2={timeToX(configuredTimeout)}
                  y2={SVG_HEIGHT - FOOTER_HEIGHT}
                  stroke="#d32f2f"
                  strokeDasharray="4 4"
                  strokeWidth="1.5"
                />
                <text
                  x={timeToX(configuredTimeout)}
                  y={HEADER_HEIGHT - 10}
                  fontSize="10"
                  fontWeight="bold"
                  fill="#d32f2f"
                  textAnchor="middle"
                  fontFamily="Roboto, sans-serif"
                >
                  Timeout ({configuredTimeout}ms)
                </text>
              </g>
            ) : mode === 'single' ? (
              /* Off-screen Timeout Indicator Pill on right edge */
              <g transform={`translate(${SVG_WIDTH - 110}, 6)`}>
                <rect x="0" y="0" width="105" height="18" rx="9" fill="#ffebee" stroke="#d32f2f" strokeWidth="1" />
                <text x="52.5" y="12" fontSize="9.5" fontWeight="bold" fill="#c62828" textAnchor="middle" fontFamily="Roboto, sans-serif">
                  Timeout: {configuredTimeout}ms →
                </text>
              </g>
            ) : null}

            {/* Bidder Rows & Section Headers */}
            {displayRows.map((row, idx) => {
              const y = HEADER_HEIGHT + idx * ROW_HEIGHT + 2;

              // Section Header Row
              if (row.isSectionHeader) {
                return (
                  <g key={`sec-${idx}`}>
                    <rect x="0" y={y + 2} width={SVG_WIDTH} height={ROW_HEIGHT - 6} fill="#e3f2fd" rx="4" />
                    <text x="12" y={y + 18} fontSize="11" fontWeight="700" fill="#0d47a1" fontFamily="Roboto, sans-serif">
                      {row.sectionTitle} {row.sectionDuration ? `— Duration: ${row.sectionDuration}ms` : ''}
                    </text>
                  </g>
                );
              }

              const barX = timeToX(row.startMs);
              const barWidth = Math.max(12, timeToX(row.endMs) - barX);

              // Color Theme
              const barColor = row.hasBid ? '#2e7d32' : row.isTimeout ? '#d32f2f' : '#757575';
              const badgeColor = row.hasBid ? '#e8f5e9' : row.isTimeout ? '#ffebee' : '#f5f5f5';
              const badgeTextColor = row.hasBid ? '#1b5e20' : row.isTimeout ? '#c62828' : '#616161';
              const statusText = row.hasBid ? (row.cpm !== undefined ? `BID $${row.cpm}` : 'BID') : row.isTimeout ? 'TIMEOUT' : 'NO BID';

              return (
                <g key={idx} style={{ cursor: 'pointer' }} onClick={() => handleRowClick(row)}>
                  {/* Row Hover Line */}
                  <rect x="0" y={y} width={SVG_WIDTH} height={ROW_HEIGHT - 4} fill="transparent" className="gantt-row" />

                  {/* Bidder Name */}
                  <text x="8" y={y + 18} fontSize="12" fontWeight="600" fill="#212121" fontFamily="Roboto, sans-serif">
                    {row.bidderCode}
                  </text>

                  {/* Status Badge */}
                  <rect x="92" y={y + 4} width="72" height="19" rx="4" fill={badgeColor} stroke={barColor} strokeWidth="0.5" />
                  <text x="128" y={y + 17} fontSize="9.5" fontWeight="bold" fill={badgeTextColor} textAnchor="middle" fontFamily="Roboto, sans-serif">
                    {statusText.length > 12 ? `${statusText.slice(0, 11)}…` : statusText}
                  </text>

                  {/* SVG Gantt Latency Bar */}
                  <rect
                    x={barX}
                    y={y + 4}
                    width={barWidth}
                    height="19"
                    rx="3"
                    ry="3"
                    fill={barColor}
                    opacity="0.88"
                  />

                  {/* Latency Text inside or right of Bar */}
                  <text
                    x={barX + barWidth + 6}
                    y={y + 18}
                    fontSize="11"
                    fontWeight="600"
                    fill="#333333"
                    fontFamily="Roboto, sans-serif"
                  >
                    {row.latencyMs}ms
                  </text>
                </g>
              );
            })}
          </svg>
        </Box>

        {/* Dialog Pop-up for Clicked Bid */}
        <BidJsonDialog open={dialogOpen} onClose={() => setDialogOpen(false)} rowData={activeRow} />
      </Paper>
    </Grid>
  );
};

export default GanttChartComponent;
