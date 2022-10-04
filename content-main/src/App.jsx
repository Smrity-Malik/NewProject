import React from 'react';
import './App.css';
import Header from './components/Header/Header';

function App() {
  return (
    <Header links={[
      {
        link: '/about',
        label: 'Features',
      },
      {
        link: '/pricing',
        label: 'Pricing',
      },
      {
        link: '/learn',
        label: 'Learn',
      },
      {
        link: '/community',
        label: 'Community',
      },
    ]}
    />
  );
}

export default App;
