from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from ..models import User, Challenge, db
from werkzeug.utils import secure_filename
import os

admin_bp = Blueprint('admin', __name__)

def admin_required(fn):
    @jwt_required()
    def wrapper(*args, **kwargs):
        user_id = get_jwt_identity()
        user = User.query.get(user_id)
        if not user or not user.is_admin:
            return jsonify({'error': 'Admin privileges required'}), 403
        return fn(*args, **kwargs)
    wrapper.__name__ = fn.__name__
    return wrapper

@admin_bp.route('/users', methods=['GET'])
@admin_required
def get_users():
    users = User.query.all()
    return jsonify({
        'users': [{
            'id': user.id,
            'username': user.username,
            'email': user.email,
            'is_admin': user.is_admin,
            'score': user.score,
            'created_at': user.created_at.isoformat()
        } for user in users]
    }), 200

@admin_bp.route('/users/<int:user_id>', methods=['PUT'])
@admin_required
def update_user(user_id):
    user = User.query.get_or_404(user_id)
    data = request.get_json()
    
    if not data:
        return jsonify({'error': 'No data provided'}), 400
    
    if 'is_admin' in data:
        user.is_admin = data['is_admin']
    
    db.session.commit()
    
    return jsonify({
        'message': 'User updated successfully',
        'user': {
            'id': user.id,
            'username': user.username,
            'email': user.email,
            'is_admin': user.is_admin
        }
    }), 200

@admin_bp.route('/challenges', methods=['POST'])
@admin_required
def create_challenge():
    data = request.form
    file = request.files.get('file')
    
    if not all(k in data for k in ['title', 'description', 'category', 'difficulty', 'points', 'flag']):
        return jsonify({'error': 'Missing required fields'}), 400
    
    challenge = Challenge(
        title=data['title'],
        description=data['description'],
        category=data['category'],
        difficulty=data['difficulty'],
        points=int(data['points']),
        flag=data['flag']
    )
    
    if file:
        filename = secure_filename(file.filename)
        file_path = os.path.join('uploads', filename)
        os.makedirs('uploads', exist_ok=True)
        file.save(file_path)
        challenge.file_path = file_path
        challenge.file_type = filename.split('.')[-1]
    
    db.session.add(challenge)
    db.session.commit()
    
    return jsonify({
        'message': 'Challenge created successfully',
        'challenge': {
            'id': challenge.id,
            'title': challenge.title,
            'category': challenge.category,
            'difficulty': challenge.difficulty,
            'points': challenge.points
        }
    }), 201

@admin_bp.route('/challenges/<int:challenge_id>', methods=['PUT'])
@admin_required
def update_challenge(challenge_id):
    challenge = Challenge.query.get_or_404(challenge_id)
    data = request.form
    file = request.files.get('file')
    
    if not data:
        return jsonify({'error': 'No data provided'}), 400
    
    # Mise à jour des champs
    if 'title' in data:
        challenge.title = data['title']
    if 'description' in data:
        challenge.description = data['description']
    if 'category' in data:
        challenge.category = data['category']
    if 'difficulty' in data:
        challenge.difficulty = data['difficulty']
    if 'points' in data:
        challenge.points = int(data['points'])
    if 'flag' in data:
        challenge.flag = data['flag']
    if 'is_active' in data:
        challenge.is_active = data['is_active'].lower() == 'true'
    
    # Gestion du fichier
    if file:
        # Suppression de l'ancien fichier si existant
        if challenge.file_path and os.path.exists(challenge.file_path):
            os.remove(challenge.file_path)
        
        filename = secure_filename(file.filename)
        file_path = os.path.join('uploads', filename)
        os.makedirs('uploads', exist_ok=True)
        file.save(file_path)
        challenge.file_path = file_path
        challenge.file_type = filename.split('.')[-1]
    
    db.session.commit()
    
    return jsonify({
        'message': 'Challenge updated successfully',
        'challenge': {
            'id': challenge.id,
            'title': challenge.title,
            'category': challenge.category,
            'difficulty': challenge.difficulty,
            'points': challenge.points,
            'is_active': challenge.is_active
        }
    }), 200

@admin_bp.route('/challenges/<int:challenge_id>', methods=['DELETE'])
@admin_required
def delete_challenge(challenge_id):
    challenge = Challenge.query.get_or_404(challenge_id)
    
    # Suppression du fichier associé
    if challenge.file_path and os.path.exists(challenge.file_path):
        os.remove(challenge.file_path)
    
    db.session.delete(challenge)
    db.session.commit()
    
    return jsonify({'message': 'Challenge deleted successfully'}), 200

@admin_bp.route('/stats', methods=['GET'])
@admin_required
def get_admin_stats():
    total_users = User.query.count()
    total_challenges = Challenge.query.count()
    active_challenges = Challenge.query.filter_by(is_active=True).count()
    
    # Statistiques par catégorie
    categories = db.session.query(Challenge.category, db.func.count(Challenge.id)).group_by(Challenge.category).all()
    category_stats = {cat: count for cat, count in categories}
    
    # Statistiques par difficulté
    difficulties = db.session.query(Challenge.difficulty, db.func.count(Challenge.id)).group_by(Challenge.difficulty).all()
    difficulty_stats = {diff: count for diff, count in difficulties}
    
    return jsonify({
        'total_users': total_users,
        'total_challenges': total_challenges,
        'active_challenges': active_challenges,
        'category_stats': category_stats,
        'difficulty_stats': difficulty_stats
    }), 200 