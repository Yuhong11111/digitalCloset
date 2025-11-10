import React from 'react';
import axios from 'axios';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { HomePage } from './pages/Home';
import Login from './pages/login';
import Closet from './pages/Closet';
import Outfits from './pages/Outfits';
import Assistant from './pages/Assistant';
import Settings from './pages/Settings';
import { UserContextProvider } from './components/UserContext';
import { ProtectedRoute } from './components/ProtectedRoute';

axios.defaults.baseURL = 'http://localhost:3000';
axios.defaults.withCredentials = true;

function App() {
  return (
    <UserContextProvider>
      <Router >
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<Login />} />
          <Route
            path="/closet"
            element={
              <ProtectedRoute>
                <Closet />
              </ProtectedRoute>
            }
          />
          <Route
            path="/outfits"
            element={
              <ProtectedRoute>
                <Outfits />
              </ProtectedRoute>
            }
          />
          <Route
            path="/assistant"
            element={
              <ProtectedRoute>
                <Assistant />
              </ProtectedRoute>
            }
          />
          <Route
            path="/settings"
            element={
              <ProtectedRoute>
                <Settings />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router >
    </UserContextProvider>
  );
}

export default App;