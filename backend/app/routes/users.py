from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from ..models import User, SolvedChallenge, Challenge, db
from datetime import datetime

users_bp = Blueprint('users', __name__)

@users_bp.route('/leaderboard', methods=['GET'])
@jwt_required()
def get_leaderboard():
    # Récupération des paramètres de filtrage
    limit = request.args.get('limit', default=10, type=int)
    
    # Récupération des utilisateurs triés par score
    users = User.query.order_by(User.score.desc()).limit(limit).all()
    
    return jsonify({
        'leaderboard': [{
            'id': user.id,
            'username': user.username,
            'score': user.score,
            'solved_challenges': len(user.solved_challenges)
        } for user in users]
    }), 200

@users_bp.route('/profile', methods=['GET'])
@jwt_required()
def get_profile():
    user_id = get_jwt_identity()
    user = User.query.get_or_404(user_id)
    
    # Récupération des challenges résolus
    solved_challenges = SolvedChallenge.query.filter_by(user_id=user_id).all()
    challenges_info = []
    
    for solved in solved_challenges:
        challenge = Challenge.query.get(solved.challenge_id)
        if challenge:
            challenges_info.append({
                'id': challenge.id,
                'title': challenge.title,
                'category': challenge.category,
                'difficulty': challenge.difficulty,
                'points': challenge.points,
                'solved_at': solved.solved_at.isoformat()
            })
    
    return jsonify({
        'id': user.id,
        'username': user.username,
        'email': user.email,
        'score': user.score,
        'created_at': user.created_at.isoformat(),
        'solved_challenges': challenges_info
    }), 200

@users_bp.route('/profile', methods=['PUT'])
@jwt_required()
def update_profile():
    user_id = get_jwt_identity()
    user = User.query.get_or_404(user_id)
    
    data = request.get_json()
    if not data:
        return jsonify({'error': 'No data provided'}), 400
    
    # Mise à jour des champs autorisés
    if 'email' in data:
        # Vérification si l'email est déjà utilisé
        existing_user = User.query.filter_by(email=data['email']).first()
        if existing_user and existing_user.id != user_id:
            return jsonify({'error': 'Email already in use'}), 400
        user.email = data['email']
    
    db.session.commit()
    
    return jsonify({
        'message': 'Profile updated successfully',
        'user': {
            'id': user.id,
            'username': user.username,
            'email': user.email
        }
    }), 200

@users_bp.route('/stats', methods=['GET'])
@jwt_required()
def get_user_stats():
    user_id = get_jwt_identity()
    user = User.query.get_or_404(user_id)
    
    # Statistiques par catégorie
    solved_by_category = {}
    for solved in user.solved_challenges:
        challenge = Challenge.query.get(solved.challenge_id)
        if challenge:
            category = challenge.category
            if category not in solved_by_category:
                solved_by_category[category] = 0
            solved_by_category[category] += 1
    
    # Statistiques par difficulté
    solved_by_difficulty = {}
    for solved in user.solved_challenges:
        challenge = Challenge.query.get(solved.challenge_id)
        if challenge:
            difficulty = challenge.difficulty
            if difficulty not in solved_by_difficulty:
                solved_by_difficulty[difficulty] = 0
            solved_by_difficulty[difficulty] += 1
    
    return jsonify({
        'total_score': user.score,
        'total_solved': len(user.solved_challenges),
        'solved_by_category': solved_by_category,
        'solved_by_difficulty': solved_by_difficulty
    }), 200 