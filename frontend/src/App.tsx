import { useEffect } from 'react';
import { 
  BrowserRouter as Router, 
  Route, 
  Routes 
} from 'react-router-dom'

import '@app/App.css';
import { 
  HeaderProvider, 
  LoadingProvider, 
  UnityBackgroundProvider, 
  FooterProvider 
} from '@app/providers';
import { routes } from '@app/routes';
import { useSetInitialValue } from '@app/global';

export const App = () => {
  const setInitialValue = useSetInitialValue();

  useEffect(() => {
    setInitialValue();
  }, []);

  return (
    <Router>
      <LoadingProvider>
        <UnityBackgroundProvider>
          <HeaderProvider>
            <FooterProvider>
              <Routes>
                {routes.map((layout) => (
                  layout.pages.map((page) => (
                    <Route path={`${layout.layout}${page.path}`} element={page.element} />
                  ))
                ))}
              </Routes>
            </FooterProvider>
          </HeaderProvider>
        </UnityBackgroundProvider>
      </LoadingProvider>
    </Router>
  );
};

export default App;
