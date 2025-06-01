import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';

const CreateTeam = () => {
  const [teamName, setTeamName] = useState('');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [loading, setLoading] = useState(false);
  const { token } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    if (!teamName.trim()) {
      setError('Team name cannot be empty.');
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/teams`, 
        { name: teamName },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSuccess('Team created successfully!');
      setTeamName(''); // Clear form
      // Optionally redirect to the new team page or challenges page
      // navigate(`/teams/${response.data.id}`);
    } catch (error) {
      console.error('Error creating team:', error);
      setError(error.response?.data?.error || 'Failed to create team.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="terminal-window">
        <div className="terminal-header">
          <div className="terminal-button terminal-button-red"></div>
          <div className="terminal-button terminal-button-yellow"></div>
          <div className="terminal-button terminal-button-green"></div>
        </div>
        <div className="terminal-text">
          <h2 className="text-xl font-bold mb-4">Create New Team</h2>
          
          {error && (
            <div className="bg-red-500 text-white px-4 py-2 mb-4 rounded">
              {error}
            </div>
          )}

          {success && (
            <div className="bg-green-500 text-white px-4 py-2 mb-4 rounded">
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="teamName" className="block text-green-400 text-sm font-bold mb-2">Team Name:</label>
              <input
                type="text"
                id="teamName"
                className="input-field"
                value={teamName}
                onChange={(e) => setTeamName(e.target.value)}
                required
                disabled={loading}
              />
            </div>
            <button
              type="submit"
              className="btn-primary"
              disabled={loading}
            >
              {loading ? 'Creating...' : 'Create Team'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateTeam; 