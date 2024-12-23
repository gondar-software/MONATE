import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'

import LoadingProvider from './providers/loading-provider';
import './App.css';

const App = () => {
  return (
    <LoadingProvider>
      <Router>
        <Routes>
          
        </Routes>
      </Router>
    </LoadingProvider>
  );
};

export default App;
