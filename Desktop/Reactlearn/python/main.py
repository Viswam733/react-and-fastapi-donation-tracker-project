from fastapi import FastAPI, Depends, HTTPException, Request, Query
from fastapi.security import OAuth2PasswordRequestForm, OAuth2PasswordBearer
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import create_engine, Column, Integer, String, Date, func
from sqlalchemy.orm import declarative_base, sessionmaker, Session
from passlib.context import CryptContext
from jose import jwt, JWTError
from datetime import date, datetime, timedelta, timezone
from pydantic import BaseModel
from database import get_db
from typing import List, Optional
from models import Donation

# ---------------------- DB Setup -------------------------
DATABASE_URL = "sqlite:///./mydb.db"
engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(bind=engine, autocommit=False, autoflush=False)
Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# ---------------------- DB Models -------------------------
class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    hashed_password = Column(String)

class Donation(Base):
    __tablename__ = "donations"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    email = Column(String)
    phone = Column(String)
    amount = Column(Integer)
    address = Column(String)
    date = Column(Date, default=date.today)

Base.metadata.create_all(bind=engine)

# ---------------------- FastAPI Setup -------------------------
app = FastAPI()
origins = ["http://localhost", "http://localhost:5173"]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---------------------- Token Setup -------------------------
SECRET_KEY = "secret123"
ALGORITHM = "HS256"
EXPIRE_MINUTES = 30
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")

def create_token(username: str, user_agent: str):
    expire = datetime.now(timezone.utc) + timedelta(minutes=EXPIRE_MINUTES)
    payload = {
        "sub": username,
        "exp": expire,
        "user_agent": user_agent
    }
    return jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)

def get_current_user(request: Request, token: str = Depends(oauth2_scheme)):
    try:
        data = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        if data.get("user_agent") != request.headers.get("user-agent"):
            raise HTTPException(status_code=401, detail="Token used in different browser")
        return data["sub"]
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid or expired token")

# ---------------------- Pydantic Model -------------------------
class DonationSchema(BaseModel):
    name: str
    email: str
    phone: str
    amount: int
    address: str
    date: date

# ---------------------- Auth Routes -------------------------
@app.post("/register")
def register(form: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    if db.query(User).filter(User.username == form.username).first():
        raise HTTPException(status_code=400, detail="User already exists")
    hashed_pw = pwd_context.hash(form.password)
    db.add(User(username=form.username, hashed_password=hashed_pw))
    db.commit()
    return {"msg": "User registered"}

@app.post("/login")
def login(request: Request, form: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = db.query(User).filter(User.username == form.username).first()
    if not user or not pwd_context.verify(form.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    token = create_token(user.username, request.headers.get("user-agent"))
    return {"access_token": token, "token_type": "bearer"}

# ---------------------- Donation Routes -------------------------
@app.post("/donate")
def donate(data: DonationSchema, db: Session = Depends(get_db), user: str = Depends(get_current_user)):
    new_donation = Donation(
        name=data.name,
        email=data.email,
        phone=data.phone,
        amount=data.amount,
        address=data.address,
        date=data.date
    )
    db.add(new_donation)
    db.commit()
    return {"msg": "Donation saved to DB"}

@app.get("/summary")
def get_summary(db: Session = Depends(get_db)):
    total_donors = db.query(Donation).count()
    total_amount = db.query(func.sum(Donation.amount)).scalar() or 0
    total_campaigns = db.query(Campaign).count()
    print("Donation received:", donation.date)
    return {
        "total_donors": total_donors,
        "total_amount": total_amount or 0,
        "total_campaigns": total_campaigns,
    }

@app.get("/donation-trend")
def get_donation_trend(
    months: Optional[List[str]] = Query(None),
    db: Session = Depends(get_db)
):
    if months is None:
        donations = db.query(Donation).all()
    else:
        donations = db.query(Donation).filter(Donation.month.in_(months)).all()

    trend_data = {}
    total_amount = 0
    total_donors = set()
    total_campaigns = set()

    for donation in donations:
        month = donation.month
        amount = donation.amount or 0
        donor = donation.donor_id
        campaign = donation.campaign_id
        total_amount += amount
        if donor:
            total_donors.add(donor)
        if campaign:
            total_campaigns.add(campaign)
        if month in trend_data:
            trend_data[month] += amount
        else:
            trend_data[month] = amount

    if months:
        for m in months:
            trend_data.setdefault(m, 0)

    return {
        "trend": trend_data,
        "summary": {
            "total_amount": total_amount,
            "total_donors": len(total_donors),
            "total_campaigns": len(total_campaigns)
        }
    }

@app.get("/donations")
def get_donations(
    month: str = Query(None),
    db: Session = Depends(get_db),
    user: str = Depends(get_current_user)
):
    query = db.query(Donation)
    if month:
        query = query.filter(func.strftime("%Y-%m", Donation.date) == month)
    return query.all()

@app.get("/trend")
def donation_trend(
    months: List[str] = Query(None),
    db: Session = Depends(get_db),
    user: str = Depends(get_current_user)
):
    query = db.query(Donation)
    if months:
        query = query.filter(func.strftime("%Y-%m", Donation.date).in_(months))
    donations = query.all()
    trend = {}

    if len(months) == 1:
        for d in donations:
            day_key = d.date.strftime("%Y-%m-%d")
            trend[day_key] = trend.get(day_key, 0) + d.amount
    else:
        for d in donations:
            month_key = d.date.strftime("%Y-%m")
            trend[month_key] = trend.get(month_key, 0) + d.amount

    sorted_trend = [{"label": k, "amount": v} for k, v in sorted(trend.items())]
    return sorted_trend

@app.get("/donations/export")
def export_donations(range: str = Query(...), db: Session = Depends(get_db)):
    today = datetime.today().date()
    if range == "week":
        start_date = today - timedelta(days=7)
    elif range == "month":
        start_date = today - timedelta(days=30)
    elif range == "90days":
        start_date = today - timedelta(days=90)
    else:
        raise HTTPException(status_code=400, detail="Invalid range")
    filtered = db.query(Donation).filter(Donation.date >= start_date).all()
    return [d.__dict__ for d in filtered]

@app.get("/dashboard")
def dashboard(
    month: Optional[str] = Query(None),
    db: Session = Depends(get_db),
    user: str = Depends(get_current_user)
):
    query = db.query(Donation)
    if month:
        query = query.filter(func.strftime("%Y-%m", Donation.date) == month)
    donations = query.all()
    total_donors = len(set((d.name, d.email, d.phone) for d in donations))
    total_amount = sum(d.amount for d in donations)
    total_campaigns = 1
    return {
        "summary": {
            "total_donors": total_donors,
            "total_amount": total_amount,
            "total_campaigns": total_campaigns
        }
    }
