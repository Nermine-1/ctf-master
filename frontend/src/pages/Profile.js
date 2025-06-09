import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';

const Profile = () => {
  const { user, updateProfile, changePassword } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [email, setEmail] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState('');

  const categories = ['Wireless', 'IoT', 'RF', 'Bluetooth', 'Zigbee', 'LoRa'];
  const difficulties = ['Easy', 'Medium', 'Hard'];

  useEffect(() => {
    if (user) {
      setEmail(user.email);
      fetchStats();
    }
  }, [user]);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/users/stats`);
      setStats(response.data);
    } catch (error) {
      console.error('Erreur lors du chargement des statistiques:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setMessage('');

    try {
      const success = await updateProfile({ email });
      if (success) {
        setMessage('Profil mis à jour avec succès');
        setEditMode(false);
      }
    } catch (error) {
      setMessage('Erreur lors de la mise à jour du profil');
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setMessage('');

    if (newPassword !== confirmPassword) {
      setMessage('Les mots de passe ne correspondent pas');
      return;
    }

    try {
      const success = await changePassword(currentPassword, newPassword);
      if (success) {
        setMessage('Mot de passe modifié avec succès');
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      }
    } catch (error) {
      setMessage('Erreur lors du changement de mot de passe');
    }
  };

  const filteredStats = stats ? {
    ...stats,
    solved_by_category: selectedCategory 
      ? { [selectedCategory]: stats.solved_by_category[selectedCategory] || 0 }
      : stats.solved_by_category,
    solved_by_difficulty: selectedDifficulty
      ? { [selectedDifficulty]: stats.solved_by_difficulty[selectedDifficulty] || 0 }
      : stats.solved_by_difficulty,
    total_score: selectedCategory || selectedDifficulty
      ? Object.entries(stats.solved_by_category)
          .filter(([category]) => !selectedCategory || category === selectedCategory)
          .reduce((sum, [_, count]) => sum + count, 0)
      : stats.total_score
  } : null;

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="card">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-cyan-500">Profil</h1>
          {!editMode && (
            <button
              onClick={() => setEditMode(true)}
              className="btn-secondary"
            >
              Modifier le profil
            </button>
          )}
        </div>

        {editMode ? (
          <form onSubmit={handleUpdateProfile} className="space-y-4">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-[#E9FF97]">
                Nom d'utilisateur
              </label>
              <input
                type="text"
                id="username"
                value={user.username}
                disabled
                className="input-field bg-gray-50"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-[#E9FF97]">
                Email
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-field"
                required
              />
            </div>

            <div className="flex space-x-4">
              <button
                type="submit"
                className="btn-primary"
              >
                Enregistrer
              </button>
              <button
                type="button"
                onClick={() => {
                  setEditMode(false);
                  setEmail(user.email);
                }}
                className="btn-secondary"
              >
                Annuler
              </button>
            </div>
          </form>
        ) : (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[#E9FF97]">Nom d'utilisateur</label>
              <p className="mt-1 text-white">{user.username}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-[#E9FF97]">Email</label>
              <p className="mt-1 text-white">{user.email}</p>
            </div>
          </div>
        )}
      </div>

      <div className="card">
        <h2 className="text-xl font-semibold text-cyan-500 mb-6">Changer le mot de passe</h2>
        <form onSubmit={handleChangePassword} className="space-y-4">
          <div>
            <label htmlFor="currentPassword" className="block text-sm font-medium text-[#E9FF97]">
              Mot de passe actuel
            </label>
            <input
              type="password"
              id="currentPassword"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="input-field"
              required
            />
          </div>

          <div>
            <label htmlFor="newPassword" className="block text-sm font-medium text-[#E9FF97]">
              Nouveau mot de passe
            </label>
            <input
              type="password"
              id="newPassword"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="input-field"
              required
            />
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-[#E9FF97]">
              Confirmer le nouveau mot de passe
            </label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="input-field"
              required
            />
          </div>

          <button
            type="submit"
            className="btn-primary"
          >
            Changer le mot de passe
          </button>
        </form>
      </div>

      {stats && (
        <div className="card">
          <h2 className="text-xl font-semibold text-cyan-500 mb-6">Statistiques</h2>
          
          <div className="mb-6 flex gap-4">
            <div className="flex-1">
              <label htmlFor="category" className="block text-sm font-medium text-[#E9FF97] mb-2">
                Catégorie
              </label>
              <select
                id="category"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="input-field w-full"
              >
                <option value="">Toutes les catégories</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="flex-1">
              <label htmlFor="difficulty" className="block text-sm font-medium text-[#E9FF97] mb-2">
                Difficulté
              </label>
              <select
                id="difficulty"
                value={selectedDifficulty}
                onChange={(e) => setSelectedDifficulty(e.target.value)}
                className="input-field w-full"
              >
                <option value="">Toutes les difficultés</option>
                {difficulties.map((difficulty) => (
                  <option key={difficulty} value={difficulty}>
                    {difficulty}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-medium text-[#E9FF97] mb-4">Score total</h3>
              <p className="text-3xl font-bold text-white">{filteredStats.total_score} points</p>
            </div>
            <div>
              <h3 className="text-lg font-medium text-[#E9FF97] mb-4">Défis résolus</h3>
              <p className="text-3xl font-bold text-white">{filteredStats.total_solved}</p>
            </div>
          </div>

          <div className="mt-8">
            <h3 className="text-lg font-medium text-[#E9FF97] mb-4">Par catégorie</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(filteredStats.solved_by_category).map(([category, count]) => (
                <div key={category} className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-cyan">{category}</p>
                  <p className="text-xl font-semibold text-black">{count}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-8">
            <h3 className="text-lg font-medium text-[#E9FF97] mb-4">Par difficulté</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {Object.entries(filteredStats.solved_by_difficulty).map(([difficulty, count]) => (
                <div key={difficulty} className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-cyan">{difficulty}</p>
                  <p className="text-xl font-semibold text-black">{count}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {message && (
        <div className={`p-4 rounded ${
          message.includes('succès') ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
        }`}>
          {message}
        </div>
      )}
    </div>
  );
};

export default Profile; 