from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from ..models import db, Team, User, team_members

teams_bp = Blueprint('teams', __name__)

@teams_bp.route('/api/teams', methods=['POST'])
@jwt_required()
def create_team():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    if not user:
        return jsonify({'error': 'User not found'}), 404

    data = request.get_json()
    if not data or 'name' not in data:
        return jsonify({'error': 'Team name is required'}), 400

    team_name = data['name']

    # Check if team name already exists
    existing_team = Team.query.filter_by(name=team_name).first()
    if existing_team:
        return jsonify({'error': 'Team name already exists'}), 400
        
    # Check if user is already in a team
    if user.teams:
         return jsonify({'error': 'User is already in a team'}), 400

    try:
        new_team = Team(name=team_name, score=0) # Initialize score to 0
        db.session.add(new_team)
        db.session.commit()

        # Add the creator as the first member
        user.teams.append(new_team)
        db.session.commit()

        return jsonify({
            'id': new_team.id,
            'name': new_team.name,
            'score': new_team.score,
            'created_at': new_team.created_at.isoformat(),
            'members': [{'id': member.id, 'username': member.username} for member in new_team.members]
        }), 201 # 201 Created

    except Exception as e:
        db.session.rollback()
        print(f"Error creating team: {e}")
        return jsonify({'error': 'An error occurred while creating the team'}), 500

# Route to get a specific team's details
@teams_bp.route('/api/teams/<int:team_id>', methods=['GET'])
@jwt_required()
def get_team(team_id):
    team = Team.query.get(team_id)
    if not team:
        return jsonify({'error': 'Team not found'}), 404

    return jsonify({
        'id': team.id,
        'name': team.name,
        'score': team.score,
        'created_at': team.created_at.isoformat(),
        'members': [{'id': member.id, 'username': member.username} for member in team.members]
    }), 200

# Route to get all teams
@teams_bp.route('/api/teams/', methods=['GET'])
@jwt_required()
def get_all_teams():
    teams = Team.query.all()
    return jsonify({
        'teams': [{
            'id': team.id,
            'name': team.name,
            'score': team.score,
            'created_at': team.created_at.isoformat(),
             'members': [{'id': member.id, 'username': member.username} for member in team.members]
        } for team in teams]
    }), 200

# Route to join a team
@teams_bp.route('/api/teams/<int:team_id>/join', methods=['POST'])
@jwt_required()
def join_team(team_id):
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    if not user:
        return jsonify({'error': 'User not found'}), 404

    team = Team.query.get(team_id)
    if not team:
        return jsonify({'error': 'Team not found'}), 404

    # Check if user is already in a team
    if user.teams:
        return jsonify({'error': 'User is already in a team'}), 400

    # Check if the team is full (max 5 members)
    if len(team.members) >= 5:
        return jsonify({'error': 'Team is full'}), 400

    try:
        team.members.append(user)
        db.session.commit()
        return jsonify({'message': f'Successfully joined team {team.name}'}), 200
    except Exception as e:
        db.session.rollback()
        print(f"Error joining team: {e}")
        return jsonify({'error': 'An error occurred while joining the team'}), 500

# TODO: Add more team routes (leave team, etc.) 