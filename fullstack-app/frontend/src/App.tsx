import React from 'react';
import axios from 'axios';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { HomePage } from './pages/Home';
import Login from './pages/login';
import Closet from './pages/Closet';
import Outfits from './pages/Outfits';
import Assistant from './pages/Assistant';
import Settings from './pages/Settings';

function App() {
  axios.defaults.baseURL = 'http://localhost:3000';
  axios.defaults.withCredentials = true;
  return (
    <Router >
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/closet" element={<Closet />} />
        <Route path="/outfits" element={<Outfits />} />
        <Route path="/assistant" element={<Assistant />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>
    </Router >
  );
}

export default App;