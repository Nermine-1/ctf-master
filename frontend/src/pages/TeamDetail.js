import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';

const TeamDetail = () => {
  const { id } = useParams();
  const [team, setTeam] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [joinLoading, setJoinLoading] = useState(false); // Loading state for joining
  const [joinError, setJoinError] = useState(null); // Error state for joining
  const { token, user } = useAuth(); // Get user from auth context

  const isMember = team?.members.some(member => member.id === user?.id); // Check if current user is a member

  useEffect(() => {
    if (token) {
      fetchTeam();
    } else {
      setLoading(false);
      setError('Please log in to view team details.');
    }
  }, [id, token]);

  const fetchTeam = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/teams/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setTeam(response.data);
      setError(null);
    } catch (error) {
      console.error('Error fetching team details:', error);
      setError(error.response?.data?.error || 'Failed to load team details.');
    } finally {
      setLoading(false);
    }
  };

  const handleJoinTeam = async () => {
    setJoinLoading(true);
    setJoinError(null);
    try {
      await axios.post(`${process.env.REACT_APP_API_URL}/teams/${id}/join`, {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      // Refresh team data after joining
      fetchTeam(); 
    } catch (error) {
      console.error('Error joining team:', error);
      setJoinError(error.response?.data?.error || 'Failed to join team.');
    } finally {
      setJoinLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (error) {
    return (
       <div className="container mx-auto px-4 py-6">
        <div className="terminal-window">
          <div className="terminal-header">
            <div className="terminal-button terminal-button-red"></div>
            <div className="terminal-button terminal-button-yellow"></div>
            <div className="terminal-button terminal-button-green"></div>
          </div>
          <div className="terminal-text text-red-500">
             {error}
          </div>
         </div>
       </div>
    );
  }

  if (!team) {
    return (
       <div className="container mx-auto px-4 py-6">
        <div className="terminal-window">
          <div className="terminal-header">
            <div className="terminal-button terminal-button-red"></div>
            <div className="terminal-button terminal-button-yellow"></div>
            <div className="terminal-button terminal-button-green"></div>
          </div>
          <div className="terminal-text text-gray-500">
             Team not found.
          </div>
         </div>
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
          <h1 className="text-2xl font-bold mb-4">Team: {team.name}</h1>
          <p className="text-gray-400 mb-4">Score: {team.score}</p>

          <h2 className="text-xl font-semibold mb-2">Members ({team.members.length}/5):</h2>
          {team.members.length > 0 ? (
            <ul className="list-disc list-inside ml-4">
              {team.members.map(member => (
                <li key={member.id} className="text-gray-300">{member.username}</li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">No members yet.</p>
          )}

          {/* Join Team Button */}
          {user && !isMember && team.members.length < 5 && (
            <div className="mt-6">
              {joinError && (
                 <div className="bg-red-500 text-white px-4 py-2 mb-4 rounded">
                   {joinError}
                 </div>
               )}
              <button
                onClick={handleJoinTeam}
                className="btn-primary"
                disabled={joinLoading}
              >
                {joinLoading ? 'Joining...' : 'Join Team'}
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default TeamDetail; 