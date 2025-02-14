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
  FooterProvider, 
  AlertProvider,
  VideoBackgroundProvider
} from '@app/providers';
import { routes } from '@app/routes';
import { useLightMode, useSetInitialValue } from '@app/global';

export const App = () => {
  const lightMode = useLightMode();
  const setInitialValue = useSetInitialValue();

  useEffect(() => {
    setInitialValue();
  }, []);

  useEffect(() => {
    if (lightMode) {
      document.documentElement.classList.remove('dark');
    } else {
      document.documentElement.classList.add('dark');
    }
  }, [lightMode]);

  return (
    <AlertProvider>
      <Router>
        <LoadingProvider>
          <VideoBackgroundProvider>
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
          </VideoBackgroundProvider>
        </LoadingProvider>
      </Router>
    </AlertProvider>
  );
};

export default App;
