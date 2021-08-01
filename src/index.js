import React from 'react';
import ReactDOM from 'react-dom';
import { DAppProvider } from '@usedapp/core';
import './styles/index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

const config = {
  readOnlyChain: 97,
  readOnlyUrls: {
    97: 'https://data-seed-prebsc-1-s1.binance.org:8545/',
  },
  supportedChains: [97],
  multicallAddresses: {
    97: '0xae11C5B5f29A6a25e955F0CB8ddCc416f522AF5C',
  },
};

ReactDOM.render(
  <React.StrictMode>
    <DAppProvider config={config}>
      <App />
    </DAppProvider>
  </React.StrictMode>,
  document.getElementById('root'),
);

reportWebVitals();
