import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';

const Challenges = () => {
  const [challenges, setChallenges] = useState([]);
  const [categories, setCategories] = useState([]);
  const [difficulties, setDifficulties] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const { user, token } = useAuth();

  useEffect(() => {
    if (token) {
      fetchChallenges();
      fetchCategories();
      fetchDifficulties();
    } else {
      setError('Veuillez vous connecter pour voir les challenges.');
      setLoading(false);
    }
  }, [token]);

  const fetchChallenges = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/challenges/`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setChallenges(response.data.challenges);
    } catch (error) {
      setError('Erreur lors du chargement des challenges');
      console.error('Error fetching challenges:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/challenges/categories/`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setCategories(response.data.categories);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchDifficulties = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/challenges/difficulties/`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setDifficulties(response.data.difficulties);
    } catch (error) {
      console.error('Error fetching difficulties:', error);
    }
  };

  const filteredChallenges = challenges.filter(challenge => {
    if (selectedCategory && challenge.category !== selectedCategory) return false;
    if (selectedDifficulty && challenge.difficulty !== selectedDifficulty) return false;
    return true;
  });

  const getDifficultyColor = (difficulty) => {
    switch (difficulty.toLowerCase()) {
      case 'facile':
        return 'bg-[#00ff9d]/20 text-[#00ff9d] border border-[#00ff9d]/30';
      case 'moyen':
        return 'bg-[#ffd700]/20 text-[#ffd700] border border-[#ffd700]/30';
      case 'difficile':
        return 'bg-[#ff3131]/20 text-[#ff3131] border border-[#ff3131]/30';
      default:
        return 'bg-[#00bcd4]/20 text-[#00bcd4] border border-[#00bcd4]/30';
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
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-white">Challenges</h1>
        <div className="flex space-x-4">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="input-field max-w-xs"
          >
            <option value="">Toutes les catégories</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
          <select
            value={selectedDifficulty}
            onChange={(e) => setSelectedDifficulty(e.target.value)}
            className="input-field max-w-xs"
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

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {filteredChallenges.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredChallenges.map((challenge) => (
            <Link
              key={challenge.id}
              to={`/challenges/${challenge.id}`}
              className="card hover:shadow-lg transition-shadow duration-200"
            >
              <div className="flex justify-between items-start">
                <h3 className="text-lg font-semibold text-cyan-400 hover:text-[#00ff9d] transition-colors duration-300">{challenge.title}</h3>
                <span className={`badge ${getDifficultyColor(challenge.difficulty)}`}>
                  {challenge.difficulty}
                </span>
              </div>
              <div className="mt-2">
                <p className="mt-2 text-white line-clamp-2">{challenge.description}</p>
                <div className="mt-2 flex items-center justify-between">
                  <span className="text-sm text-white">{challenge.category}</span>
                  <span className="text-sm font-medium text-white">{challenge.points} points</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        !loading && (
          <div className="text-center py-12">
            <p className="text-white">Aucun challenge trouvé</p>
          </div>
        )
      )}
    </div>
  );
};

export default Challenges; 