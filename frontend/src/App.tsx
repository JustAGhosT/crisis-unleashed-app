import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import FactionRoutes from './routes/FactionRoutes';
import './App.css';

// For testing purposes, we're displaying the Faction Portal directly
// In a real application, you would integrate this with other routes
function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Routes>
          <Route path="/*" element={<FactionRoutes />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;