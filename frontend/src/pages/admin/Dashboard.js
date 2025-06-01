import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/admin/stats`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      setStats(response.data);
    } catch (error) {
      setError('Erreur lors du chargement des statistiques');
      console.error('Error fetching stats:', error);
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
    <div className="max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-cyan-400">Tableau de bord administrateur</h1>
        <div className="flex space-x-4">
          <Link to="/admin/challenges" className="btn-primary">
            Gérer les challenges
          </Link>
          <Link to="/admin/users" className="btn-secondary">
            Gérer les utilisateurs
          </Link>
        </div>
      </div>

      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="card">
            <h3 className="text-lg font-medium text-cyan-400 mb-2">Utilisateurs</h3>
            <p className="text-3xl font-bold text-[#00ff9d]">{stats.total_users}</p>
          </div>
          <div className="card">
            <h3 className="text-lg font-medium text-cyan-400 mb-2">Challenges</h3>
            <p className="text-3xl font-bold text-[#00ff9d]">{stats.total_challenges}</p>
            <p className="text-sm text-white mt-1">
              {stats.active_challenges} challenges actifs
            </p>
          </div>
          <div className="card">
            <h3 className="text-lg font-medium text-cyan-400 mb-2">Taux de complétion</h3>
            <p className="text-3xl font-bold text-[#00ff9d]">
              {stats.total_challenges > 0
                ? Math.round((stats.active_challenges / stats.total_challenges) * 100)
                : 0}%
            </p>
          </div>
        </div>
      )}

      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="card">
            <h2 className="text-xl font-semibold text-cyan-400 mb-6">Challenges par catégorie</h2>
            <div className="space-y-4">
              {Object.entries(stats.category_stats).map(([category, count]) => (
                <div key={category} className="flex items-center justify-between">
                  <span className="text-white">{category}</span>
                  <span className="text-[#00ff9d] font-medium">{count}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="card">
            <h2 className="text-xl font-semibold text-cyan-400 mb-6">Challenges par difficulté</h2>
            <div className="space-y-4">
              {Object.entries(stats.difficulty_stats).map(([difficulty, count]) => (
                <div key={difficulty} className="flex items-center justify-between">
                  <span className="text-white">{difficulty}</span>
                  <span className="text-[#00ff9d] font-medium">{count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard; 