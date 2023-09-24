import React from 'react';
import RegisterAndLoginForm from './components/RegisterAndLoginForm';
import { UserProvider } from './components/UserContext';
import { BrowserRouter as Router, Route, Routes, Navigate, useNavigate } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './components/Home';
import AddHome from './components/AddHome';
import HomeManager from './components/HomeManager';
import HomeDetail from './components/HomeDetail';
import EditListing from "./components/EditListing";
import UserProfile from './components/UserProfile';

function HomePage() {
  return <div className="Home"><Home /></div>;
}

function App() {
  return (
    <Router>
      <UserProvider>
        <Routes>
            <Route path="/login" element={<RegisterAndLoginForm />} />
            <Route path="/home" element={<Home />} />
            <Route path="/addhome" element={<AddHome/>} />
            <Route path="/homemanager" element={<HomeManager/>} />
            <Route path="/edit-listing/:homeId" element={<EditListing />} />
            <Route path="/home/:id" element={<HomeDetail />} />
            <Route path="*" element={<RegisterAndLoginForm />} />
            <Route path="/userprofile" element={<UserProfile />} />
        </Routes>
      </UserProvider>
    </Router>
  );
}

export default App;