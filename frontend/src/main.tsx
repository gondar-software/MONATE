import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';

import './index.css';

import App from './App';
import store, { persistor } from './global/stores';
import LoadingMonate from './components/loading-monate';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <PersistGate loading={<LoadingMonate />} persistor={persistor}>
        <App />
      </PersistGate>
    </Provider>
  </StrictMode>,
);
