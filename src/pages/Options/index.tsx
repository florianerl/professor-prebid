import React from 'react';
import { render } from 'react-dom';

import Options from './Options';
import AppLayout from '../Shared/layouts/AppLayout';

render(
  <AppLayout>
    <Options title={'Settings'} />
  </AppLayout>,
  window.document.querySelector('#app-container'),
);

if ((module as any).hot) (module as any).hot.accept();
