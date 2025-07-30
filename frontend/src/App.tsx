import React, { FC } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import GameInterface from './components/GameInterface';

const App: FC = () => {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<GameInterface />}>
            <Route index element={<GameInterface />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
};

export default App;
