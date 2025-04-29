import React from 'react';
import ReactDOM from 'react-dom/client';
import HoroscopeFetcher from './HoroscopeFetcher';

const App = () => (
  <div>
    <h1>Welcome to Crypt'Oracle</h1>
    <p>Frontend is running locally!</p>
    <p>Accessible through Reverse Proxy</p>
    <HoroscopeFetcher />
  </div>
);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
