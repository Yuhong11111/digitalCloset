import React from 'react';
import axios from 'axios';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { HomePage } from './pages/Home';
import Login from './pages/login';
import { Closet } from './pages/Closet';


function App() {
  axios.defaults.baseURL = 'http://localhost:3000';
  axios.defaults.withCredentials = true;
  return (
    <Router >
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/closet" element={<Closet />} />
      </Routes>
    </Router >
  );
}

export default App;