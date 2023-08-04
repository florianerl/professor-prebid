import React, { useContext, useState } from 'react';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import AppStateContext from '../../contexts/appStateContext';
import PbjsVersionInfoPopOver from '../pbjsVersionInfo/PbjsVersionInfoPopOver';
import EventsPopOver from '../auctionDebugEvents/EventsPopOver';
import { conditionalPluralization } from '../../utils';

interface HeaderGridItemProps {
  children: JSX.Element | string;
  onClick?: React.MouseEventHandler<HTMLDivElement>;
}

const HeaderGridItem = ({ children, onClick }: HeaderGridItemProps): JSX.Element => (
  <Grid item onClick={onClick}>
    <Paper sx={{ p: 1 }} elevation={1}>
      <Typography variant="h2">{children}</Typography>
    </Paper>
  </Grid>
);

const AdUnitsHeaderComponent = (): JSX.Element => {
  const [eventsPopUpOpen, setEventsPopUpOpen] = useState<boolean>(false);
  const [pbjsVersionPopUpOpen, setPbjsVersionPopUpOpen] = useState<boolean>(false);
  const { allBidResponseEvents, prebid, allNoBidEvents, allBidderEvents, allAdUnitCodes, events } = useContext(AppStateContext);
  if (!prebid) return null;
  return (
    <>
      <HeaderGridItem onClick={() => setPbjsVersionPopUpOpen(true)}><div style={{cursor: "pointer"}}>{`Version: ${prebid.version}`}</div></HeaderGridItem>
      <PbjsVersionInfoPopOver pbjsVersionPopUpOpen={pbjsVersionPopUpOpen} setPbjsVersionPopUpOpen={setPbjsVersionPopUpOpen} />

      <HeaderGridItem>{`Timeout: ${prebid.config?.bidderTimeout}`}</HeaderGridItem>

      <HeaderGridItem>{`AdUnit${conditionalPluralization(allAdUnitCodes)}: ${allAdUnitCodes.length}`}</HeaderGridItem>

      <HeaderGridItem>{`Bidder${conditionalPluralization(allBidderEvents)}: ${allBidderEvents.length}`}</HeaderGridItem>

      <HeaderGridItem>{`Bid${conditionalPluralization(allBidResponseEvents)}: ${allBidResponseEvents.length}`}</HeaderGridItem>

      <HeaderGridItem>{`NoBid${conditionalPluralization(allNoBidEvents)}: ${allNoBidEvents.length}`}</HeaderGridItem>

      <HeaderGridItem onClick={() => setEventsPopUpOpen(true)}>
        <div style={{cursor: "pointer"}}>{`Event${conditionalPluralization(events)}: ${events?.length}`}</div></HeaderGridItem>
      <EventsPopOver eventsPopUpOpen={eventsPopUpOpen} setEventsPopUpOpen={setEventsPopUpOpen} />
    </>
  );
};

export default AdUnitsHeaderComponent;
