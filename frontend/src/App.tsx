import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'

import '@app/App.css';
import { LoadingProvider } from '@app/providers';
import { routes } from '@app/routes';

export const App = () => {
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
