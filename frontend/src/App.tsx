import { useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'

import '@app/App.css';
import { LoadingProvider } from '@app/providers';
import { routes } from '@app/routes';
import { useSetInitialValue } from './global';
import UnityBackgroundProvider from './providers/unity-background-provider';

export const App = () => {
  const setInitialValue = useSetInitialValue();

  useEffect(() => {
    setInitialValue();
  }, []);

  return (
    <LoadingProvider>
      <UnityBackgroundProvider>
        <Router>
          <Routes>
            {routes.map((layout) => (
              layout.pages.map((page) => (
                <Route path={`${layout.layout}${page.path}`} element={page.element} />
              ))
            ))}
          </Routes>
        </Router>
      </UnityBackgroundProvider>
    </LoadingProvider>
  );
};

export default App;
