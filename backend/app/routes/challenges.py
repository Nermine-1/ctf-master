from flask import Blueprint, request, jsonify, send_file
from flask_jwt_extended import jwt_required, get_jwt_identity
from ..models import Challenge, User, SolvedChallenge, db
from datetime import datetime
import os

challenges_bp = Blueprint('challenges', __name__)

@challenges_bp.route('/', methods=['GET'])
@jwt_required()
def get_challenges():
    # Récupération des paramètres de filtrage
    category = request.args.get('category')
    difficulty = request.args.get('difficulty')
    
    # Construction de la requête
    query = Challenge.query.filter_by(is_active=True)
    
    if category:
        query = query.filter_by(category=category)
    if difficulty:
        query = query.filter_by(difficulty=difficulty)
    
    challenges = query.all()
    
    # Récupération des challenges résolus par l'utilisateur
    user_id = get_jwt_identity()
    solved_challenges = SolvedChallenge.query.filter_by(user_id=user_id).all()
    solved_ids = [sc.challenge_id for sc in solved_challenges]
    
    return jsonify({
        'challenges': [{
            'id': c.id,
            'title': c.title,
            'description': c.description,
            'category': c.category,
            'difficulty': c.difficulty,
            'points': c.points,
            'is_solved': c.id in solved_ids,
            'created_at': c.created_at.isoformat()
        } for c in challenges]
    }), 200

@challenges_bp.route('/<int:challenge_id>', methods=['GET'])
@jwt_required()
def get_challenge(challenge_id):
    challenge = Challenge.query.get_or_404(challenge_id)
    
    if not challenge.is_active:
        return jsonify({'error': 'Challenge not found'}), 404
    
    return jsonify({
        'id': challenge.id,
        'title': challenge.title,
        'description': challenge.description,
        'category': challenge.category,
        'difficulty': challenge.difficulty,
        'points': challenge.points,
        'created_at': challenge.created_at.isoformat(),
        'has_file': bool(challenge.file_path)
    }), 200

@challenges_bp.route('/<int:challenge_id>/file', methods=['GET'])
@jwt_required()
def get_challenge_file(challenge_id):
    challenge = Challenge.query.get_or_404(challenge_id)
    
    if not challenge.file_path or not os.path.exists(challenge.file_path):
        return jsonify({'error': 'File not found'}), 404
    
    return send_file(
        challenge.file_path,
        as_attachment=True,
        download_name=f"challenge_{challenge_id}_{challenge.file_type}"
    )

@challenges_bp.route('/<int:challenge_id>/submit', methods=['POST'])
@jwt_required()
def submit_flag(challenge_id):
    user_id = get_jwt_identity()
    user = User.query.get_or_404(user_id)
    challenge = Challenge.query.get_or_404(challenge_id)
    
    # Vérification si le challenge est déjà résolu
    if SolvedChallenge.query.filter_by(user_id=user_id, challenge_id=challenge_id).first():
        return jsonify({'error': 'Challenge already solved'}), 400
    
    data = request.get_json()
    if not data or 'flag' not in data:
        return jsonify({'error': 'Flag is required'}), 400
    
    if data['flag'] == challenge.flag:
        # Création de l'entrée SolvedChallenge
        solved = SolvedChallenge(user_id=user_id, challenge_id=challenge_id)
        db.session.add(solved)
        
        # Mise à jour du score de l'utilisateur
        user.score += challenge.points
        db.session.commit()
        
        return jsonify({
            'message': 'Correct flag!',
            'points_earned': challenge.points
        }), 200
    
    return jsonify({'error': 'Incorrect flag'}), 400

@challenges_bp.route('/categories', methods=['GET'])
@jwt_required()
def get_categories():
    categories = db.session.query(Challenge.category).distinct().all()
    return jsonify({
        'categories': [category[0] for category in categories]
    }), 200

@challenges_bp.route('/difficulties', methods=['GET'])
@jwt_required()
def get_difficulties():
    difficulties = db.session.query(Challenge.difficulty).distinct().all()
    return jsonify({
        'difficulties': [difficulty[0] for difficulty in difficulties]
    }), 200 