from database import SessionLocal
from models import User

db = SessionLocal()
users = db.query(User).all()

for user in users:
    print(f"Username: {user.username}, Password Hash: {user.hashed_password}")
db.close()
