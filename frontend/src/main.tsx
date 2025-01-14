import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';

import '@app/index.css';

import App from '@app/App';
import { store, persistor } from '@app/global';
import { LoadingMonate } from '@app/components';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <PersistGate loading={<LoadingMonate />} persistor={persistor}>
        <App />
      </PersistGate>
    </Provider>
  </StrictMode>,
);
