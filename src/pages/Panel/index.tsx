import React from 'react';
import { render } from 'react-dom';
import Panel from './Panel';
import AppLayout from '../Shared/layouts/AppLayout';

render(
  <AppLayout>
    <Panel />
  </AppLayout>,
  window.document.querySelector('#app-container'),
);

// (module as any)?.hot?.accept();
