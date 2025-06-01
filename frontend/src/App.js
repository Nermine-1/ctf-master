import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Challenges from './pages/Challenges';
import ChallengeDetail from './pages/ChallengeDetail';
import Profile from './pages/Profile';
import Leaderboard from './pages/Leaderboard';
import AdminDashboard from './pages/admin/Dashboard';
import AdminChallenges from './pages/admin/Challenges';
import AdminUsers from './pages/admin/Users';
import CreateTeam from './pages/CreateTeam';
import TeamList from './pages/TeamList';
import TeamDetail from './pages/TeamDetail';

function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate system boot sequence
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="terminal-window w-96">
          <div className="terminal-header">
            <div className="terminal-button terminal-button-red"></div>
            <div className="terminal-button terminal-button-yellow"></div>
            <div className="terminal-button terminal-button-green"></div>
          </div>
          <div className="terminal-text">
            <p className="typing-animation">Initializing CTF Platform...</p>
            <p className="loading-dots mt-2">Loading system modules</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <AuthProvider>
        <div className="min-h-screen bg-black matrix-bg">
          <header className="bg-black/90 border-b border-green-500/30">
            <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
              <h1 className="text-3xl font-bold text-green-400 glitch-text">CTF Platform</h1>
            </div>
          </header>
          <main>
            <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
              <Navbar />
              <div className="terminal-window mt-6">
                <Routes>
                  {/* Routes publiques */}
                  <Route path="/" element={<Home />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  
                  {/* Routes protégées */}
                  <Route path="/challenges" element={
                    <PrivateRoute>
                      <Challenges />
                    </PrivateRoute>
                  } />
                  <Route path="/challenges/:id" element={
                    <PrivateRoute>
                      <ChallengeDetail />
                    </PrivateRoute>
                  } />
                  <Route path="/profile" element={
                    <PrivateRoute>
                      <Profile />
                    </PrivateRoute>
                  } />
                  <Route path="/leaderboard" element={
                    <PrivateRoute>
                      <Leaderboard />
                    </PrivateRoute>
                  } />
                  <Route path="/teams/create" element={
                    <PrivateRoute>
                      <CreateTeam />
                    </PrivateRoute>
                  } />
                  <Route path="/teams" element={
                    <PrivateRoute>
                      <TeamList />
                    </PrivateRoute>
                  } />
                  <Route path="/teams/:id" element={
                    <PrivateRoute>
                      <TeamDetail />
                    </PrivateRoute>
                  } />
                  
                  {/* Routes admin */}
                  <Route path="/admin" element={
                    <PrivateRoute adminOnly>
                      <AdminDashboard />
                    </PrivateRoute>
                  } />
                  <Route path="/admin/challenges" element={
                    <PrivateRoute adminOnly>
                      <AdminChallenges />
                    </PrivateRoute>
                  } />
                  <Route path="/admin/users" element={
                    <PrivateRoute adminOnly>
                      <AdminUsers />
                    </PrivateRoute>
                  } />
                </Routes>
              </div>
            </div>
          </main>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App; 