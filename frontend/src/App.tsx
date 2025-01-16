import { useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'

import '@app/App.css';
import { LoadingProvider } from '@app/providers';
import { routes } from '@app/routes';
import { useSetInitialValue } from './global';

export const App = () => {
  const setInitialValue = useSetInitialValue();

  useEffect(() => {
    setInitialValue();
  }, []);

  return (
    <LoadingProvider>
      <Router>
        <Routes>
          {routes.map((layout) => (
            layout.pages.map((page) => (
              <Route path={`${layout.layout}${page.path}`} element={page.element} />
            ))
          ))}
        </Routes>
      </Router>
    </LoadingProvider>
  );
};

export default App;
