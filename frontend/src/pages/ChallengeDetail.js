import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const ChallengeDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [challenge, setChallenge] = useState(null);
  const [flag, setFlag] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [submitStatus, setSubmitStatus] = useState(null);

  useEffect(() => {
    fetchChallenge();
  }, [id]);

  const fetchChallenge = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/challenges/${id}`);
      setChallenge(response.data);
    } catch (error) {
      setError('Erreur lors du chargement du challenge');
      console.error('Error fetching challenge:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitStatus(null);

    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/challenges/${id}/submit`, {
        flag
      });
      setSubmitStatus({
        success: true,
        message: 'Félicitations ! Flag correct !',
        points: response.data.points_earned
      });
      setFlag('');
      // Rafraîchir les données du challenge
      fetchChallenge();
    } catch (error) {
      setSubmitStatus({
        success: false,
        message: error.response?.data?.error || 'Flag incorrect'
      });
    }
  };

  const handleDownload = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/challenges/${id}/file`,
        { responseType: 'blob' }
      );
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `challenge_${id}_file`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      setError('Erreur lors du téléchargement du fichier');
      console.error('Error downloading file:', error);
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

  if (!challenge) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Challenge non trouvé</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-cyan-400">{challenge.title}</h1>
          <div className="mt-2 flex items-center space-x-4">
            <span className="text-sm text-neon-green">Catégorie: {challenge.category}</span>
            <span className="text-sm text-gray-500">Difficulté: {challenge.difficulty}</span>
            <span className="text-sm font-medium text-gray-900">{challenge.points} points</span>
          </div>
        </div>
        {challenge.has_file && (
          <button
            onClick={handleDownload}
            className="btn-secondary"
          >
            Télécharger le fichier
          </button>
        )}
      </div>

      <div className="card">
        <h2 className="text-xl font-semibold text-neon-green mb-4">Description</h2>
        <div className="prose max-w-none">
          <p className="text-gray-600 whitespace-pre-wrap">{challenge.description}</p>
        </div>
      </div>

      <div className="card">
        <h2 className="text-xl font-semibold text-neon-green mb-4">Soumettre votre réponse</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="flag" className="block text-sm font-medium text-gray-700">
              Flag
            </label>
            <div className="mt-1">
              <input
                type="text"
                id="flag"
                value={flag}
                onChange={(e) => setFlag(e.target.value)}
                className="input-field"
                placeholder="Entrez votre flag ici"
                required
              />
            </div>
          </div>

          {submitStatus && (
            <div className={`p-4 rounded ${
              submitStatus.success ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
            }`}>
              {submitStatus.message}
              {submitStatus.points && (
                <p className="mt-1 font-medium">
                  Vous avez gagné {submitStatus.points} points !
                </p>
              )}
            </div>
          )}

          <button
            type="submit"
            className="btn-primary w-full"
          >
            Soumettre
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChallengeDetail; 