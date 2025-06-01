import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';

const TeamList = () => {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { token, user } = useAuth();

  useEffect(() => {
    if (token) {
      fetchTeams();
    } else {
      setLoading(false);
      setError('Please log in to view teams.');
    }
  }, [token]);

  const fetchTeams = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/teams/`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setTeams(response.data.teams);
      setError(null);
    } catch (error) {
      console.error('Error fetching teams:', error);
      setError(error.response?.data?.error || 'Failed to load teams.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="terminal-window">
        <div className="terminal-header">
          <div className="terminal-button terminal-button-red"></div>
          <div className="terminal-button terminal-button-yellow"></div>
          <div className="terminal-button terminal-button-green"></div>
        </div>
        <div className="terminal-text">
          <h1 className="text-2xl font-bold mb-6">Teams</h1>

          {error && (
            <div className="bg-red-500 text-white px-4 py-2 mb-4 rounded">
              {error}
            </div>
          )}

          {teams.length === 0 && !error && (
            <p className="text-gray-500">No teams found.</p>
          )}

          {teams.length > 0 && (
            <ul className="space-y-4">
              {teams.map((team) => (
                <li key={team.id} className="border border-green-500/50 rounded-md p-4 hover:shadow-lg transition-shadow duration-200">
                  <Link to={`/teams/${team.id}`} className="block">
                    <h2 className="text-xl font-semibold text-green-400">{team.name}</h2>
                    <p className="text-gray-400">Score: {team.score}</p>
                    <p className="text-gray-400">Members: {team.members.length}/5</p>
                  </Link>
                </li>
              ))}
            </ul>
          )}

          {/* Optional: Link to create team if user is not in a team */}
          {user && !user.teams.length && (
              <div className="mt-6 text-center">
                <Link to="/teams/create" className="btn-primary">Create a Team</Link>
              </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TeamList; 