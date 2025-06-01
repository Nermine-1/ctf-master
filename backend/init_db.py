from app import create_app, db
from app.models import Challenge, User

def init_db():
    app = create_app()
    with app.app_context():
        # Créer les tables
        db.create_all()
        
        # Ajouter des challenges
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
        
        # Ajouter les challenges à la base de données
        for challenge in challenges:
            db.session.add(challenge)
        
        # Sauvegarder les changements
        db.session.commit()
        print("Base de données initialisée avec succès!")

if __name__ == "__main__":
    init_db() 