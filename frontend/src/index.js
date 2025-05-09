import React from 'react';
import ReactDOM from 'react-dom/client';
import HoroscopeFetcher from './HoroscopeFetcher';
import HomePage from './Homepage';
import './index.css';
import 'bootstrap/dist/css/bootstrap.min.css';

const App = () => (
  <div>
    <HomePage />
  </div>
);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
