import React from 'react';
import { render } from 'react-dom';
import { Popup } from './Popup';
import AppLayout from '../Shared/layouts/AppLayout';
render(
  <AppLayout>
    <Popup />
  </AppLayout>,
  document.getElementById('root'),
);
const handleResize = () => {
  const width = window.innerWidth;
  const body = document.querySelector('body');
  body.style.width = width + 'px';
};
const interval = setInterval(() => handleResize, 1000);
window.addEventListener('resize', handleResize);
window.addEventListener('beforeunload', () => clearInterval(interval));
