// filepath: /Users/yuhong/Desktop/sl/digitalCloset/fullstack-app/frontend/src/index.tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { ChakraProvider } from '@chakra-ui/react';
import App from './App';
import { system } from './theme';

const container = document.getElementById('root');

if (!container) {
  throw new Error('Root container not found. Did you forget to add <div id="root" /> to index.html?');
}

const root = ReactDOM.createRoot(container);

root.render(
  <React.StrictMode>
    <ChakraProvider value={system}>
      <App />
    </ChakraProvider>
  </React.StrictMode>
);
