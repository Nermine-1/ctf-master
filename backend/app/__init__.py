from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager
from flask_cors import CORS
from flask_migrate import Migrate
from datetime import timedelta
import os
from dotenv import load_dotenv

# Chargement des variables d'environnement
load_dotenv()

# Initialisation des extensions
db = SQLAlchemy()
jwt = JWTManager()
migrate = Migrate()
cors = CORS()

def create_app():
    app = Flask(__name__)
    
    # Configuration
    app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'dev-key-change-in-production')
    app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL', 'postgresql://postgres:postgres@localhost/ctf_db')
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    app.config['JWT_SECRET_KEY'] = os.getenv('JWT_SECRET_KEY', 'jwt-secret-key-change-in-production')
    app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(hours=1)
    
    # Initialisation des extensions avec l'app
    cors.init_app(app)
    db.init_app(app)
    jwt.init_app(app)
    migrate.init_app(app, db)
    
    # Enregistrement des blueprints
    from .routes.auth import auth_bp
    from .routes.challenges import challenges_bp
    from .routes.users import users_bp
    from .routes.admin import admin_bp
    from .routes.teams import teams_bp
    
    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    app.register_blueprint(challenges_bp, url_prefix='/api/challenges')
    app.register_blueprint(users_bp, url_prefix='/api/users')
    app.register_blueprint(admin_bp, url_prefix='/api/admin')
    app.register_blueprint(teams_bp, url_prefix='/api')
    
    # Création des tables de la base de données
    with app.app_context():
        db.create_all()
        
        # Vérifier si des utilisateurs existent déjà
        from .models import User, Challenge
        if User.query.count() == 0:
            # Créer un utilisateur de test
            test_user = User(
                username="test",
                email="test@example.com",
                is_admin=True
            )
            test_user.set_password("password123")
            db.session.add(test_user)
            db.session.commit()
        
        # Vérifier si des challenges existent déjà
        if Challenge.query.count() == 0:
            # Ajouter des challenges par défaut
            challenges = [
                Challenge(
                    title="WiFi Sniffing 101",
                    description="Capturez et analysez le trafic WiFi pour trouver le flag caché.",
                    category="Wireless",
                    difficulty="Easy",
                    points=100,
                    flag="FLAG{WIFI_SNIFFING_BASICS}",
                    is_active=True
                ),
                Challenge(
                    title="IoT Device Analysis",
                    description="Analysez le firmware d'un appareil IoT pour trouver des vulnérabilités.",
                    category="IoT",
                    difficulty="Medium",
                    points=200,
                    flag="FLAG{IOT_SECURITY_101}",
                    is_active=True
                ),
                Challenge(
                    title="Bluetooth Security",
                    description="Trouvez la vulnérabilité dans la communication Bluetooth.",
                    category="Wireless",
                    difficulty="Hard",
                    points=300,
                    flag="FLAG{BLUETOOTH_HACK}",
                    is_active=True
                ),
                Challenge(
                    title="RF Signal Analysis",
                    description="Analysez le signal RF pour décoder le message secret.",
                    category="RF",
                    difficulty="Medium",
                    points=250,
                    flag="FLAG{RF_ANALYSIS}",
                    is_active=True
                )
            ]
            for challenge in challenges:
                db.session.add(challenge)
            db.session.commit()
    
    return app 