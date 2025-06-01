import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Leaderboard = () => {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const fetchLeaderboard = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/users/leaderboard`);
      setLeaderboard(response.data.leaderboard);
    } catch (error) {
      setError('Erreur lors du chargement du classement');
      console.error('Error fetching leaderboard:', error);
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

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded">
        {error}
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-cyan-400 mb-8">Classement</h1>

      <div className="card">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-[#00bcd4]/30">
            <thead>
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-cyan-400 uppercase tracking-wider">
                  Rang
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-cyan-400 uppercase tracking-wider">
                  Utilisateur
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-cyan-400 uppercase tracking-wider">
                  Score
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-cyan-400 uppercase tracking-wider">
                  Challenges résolus
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#00bcd4]/30">
              {leaderboard.map((user, index) => (
                <tr key={user.id} className={index < 3 ? 'bg-[#00bcd4]/10' : ''}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">
                    {index + 1}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-8 w-8 rounded-full bg-[#00bcd4] flex items-center justify-center text-white">
                        {user.username[0].toUpperCase()}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-white">
                          {user.username}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                    {user.score} points
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                    {user.solved_challenges}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {leaderboard.length === 0 && (
          <div className="text-center py-12">
            <p className="text-white">Aucun utilisateur dans le classement</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Leaderboard; 