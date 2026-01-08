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
import AddItem from './pages/AddItem';
import { ClothContextProvider } from './components/ClothContext';
import { API_BASE_URL } from './config';

axios.defaults.baseURL = API_BASE_URL;
// So every Axios request uses that base URL and automatically includes credentials
axios.defaults.withCredentials = true;

function App() {
  return (
    <UserContextProvider>
      <ClothContextProvider>
        <Router >
          <Routes>
            <Route path="/add" element={
              <ProtectedRoute>
                <AddItem />
              </ProtectedRoute>
            } />
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
      </ClothContextProvider>
    </UserContextProvider>
  );
}

export default App;