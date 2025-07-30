import React, { FC } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import GameInterface from './components/GameInterface';

const App: FC = () => {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<GameInterface />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
};

export default App;
