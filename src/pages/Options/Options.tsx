import React, { useContext } from 'react';
import { List, ListItem, ListItemText, Checkbox, Button, Typography, Paper } from '@mui/material';
import Box from '@mui/material/Box';
import OptionsLayout from '../Shared/layouts/OptionsLayout';
import { PAGES } from '../Shared/constants';
import OptionsContext from '../Shared/contexts/optionsContext';

const NaviOptions: React.FC<{}> = () => {
  const { selectedPopUpNavItems, setSelectedPopUpNavItems, selectedPanelNavItems, setSelectedPanelNavItems } = useContext(OptionsContext);

  const handleTogglePanel = (value: string) => {
    const currentIndex = selectedPanelNavItems.indexOf(value);
    const newChecked = [...selectedPanelNavItems];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    setSelectedPanelNavItems(newChecked);
  };

  const handleTogglePopUp = (value: string) => {
    const currentIndex = selectedPopUpNavItems.indexOf(value);
    const newChecked = [...selectedPopUpNavItems];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    setSelectedPopUpNavItems(newChecked);
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    chrome.storage.sync.set({ selectedPopUpNavItems }, () => {
      console.log('Selected Popup Items saved to Chrome storage: ', selectedPopUpNavItems);
    });
    chrome.storage.sync.set({ selectedPanelNavItems }, () => {
      console.log('Selected Panel Items saved to Chrome storage: ', selectedPanelNavItems);
    });
  };

  const handleReset = () => {
    setSelectedPopUpNavItems([]);
    setSelectedPanelNavItems([]);
    chrome.storage.sync.clear(() => {
      console.log('Selected Popup Items reset in Chrome storage');
      window.location.reload();
    });
  };

  return (
    <Paper sx={{ p: 1 }}>
      <Typography variant="h2" component="div" gutterBottom>
        Enable or disable the following pages in the pop-up:
      </Typography>
      <form onSubmit={handleSubmit}>
        <List sx={{ display: 'flex', flexDirection: 'row' }}>
          {PAGES.map(({ path, label, Icon, beta }) => (
            <ListItem key={path} dense onClick={() => handleTogglePopUp(path)}>
              <Checkbox edge="start" checked={selectedPopUpNavItems.indexOf(path) !== -1} tabIndex={-1} disableRipple inputProps={{ 'aria-labelledby': `checkbox-list-label-${path}` }} />
              <Icon />
              <ListItemText id={`checkbox-list-label-${path}`} primary={label} />
            </ListItem>
          ))}
        </List>

        <Typography variant="h2" component="div" gutterBottom>
          Enable or disable the following pages in the dev-tools-panel:
        </Typography>
        <List sx={{ display: 'flex', flexDirection: 'row' }}>
          {PAGES.map(({ path, label, Icon, beta }) => (
            <ListItem key={path} dense onClick={() => handleTogglePanel(path)}>
              <Checkbox edge="start" checked={selectedPanelNavItems.indexOf(path) !== -1} tabIndex={-1} disableRipple inputProps={{ 'aria-labelledby': `checkbox-list-label-${path}` }} />
              <Icon />
              <ListItemText id={`checkbox-list-label-${path}`} primary={label} />
            </ListItem>
          ))}
        </List>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'flex-end',
            alignItems: 'flex-start',
            alignContent: 'flex-start',
            columnGap: 1,
          }}
        >
          <Button type="submit" variant="outlined" color="primary">
            Save
          </Button>
          <Button variant="outlined" color="warning" onClick={handleReset}>
            Reset
          </Button>
        </Box>
      </form>
    </Paper>
  );
};

const Options: React.FC<{ title: string }> = ({ title }) => {
  return (
    <OptionsLayout>
      <NaviOptions />
    </OptionsLayout>
  );
};

export default Options;
