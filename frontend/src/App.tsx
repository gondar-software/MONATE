import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'

import '@app/App.css';
import { LoadingProvider } from '@app/providers';
import { Home } from '@app/pages';

const App = () => {
  return (
    <LoadingProvider>
      <Router>
        <Routes>
          <Route path='/' element={<Home />} />
        </Routes>
      </Router>
    </LoadingProvider>
  );
};

export default App;
