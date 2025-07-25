import { createRoot } from 'react-dom/client';

import Newtab from './Newtab';

const container = document.getElementById('app-container');
const root = createRoot(container); // createRoot(container!) if you use TypeScript
root.render(<Newtab />);
