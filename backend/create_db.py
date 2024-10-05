from sqlalchemy import Column, Integer, String, ForeignKey, Table, UniqueConstraint, JSON
from sqlalchemy.orm import relationship, declarative_base
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from config import Config

Base = declarative_base()

class User(Base):
    __tablename__ = 'users'
    
    user_id = Column(Integer, primary_key=True, autoincrement=True)
    email = Column(String(255), nullable=False, unique=True)
    first_name = Column(String(255), nullable=False)
    last_name = Column(String(255), nullable=False)
    password_hash = Column(String(255), nullable=False)  # Store hashed passwords

    # Relationships with favorite and watchlist movies
    favorite_movie_ids = Column(JSON, default=[])  # Store list of favorite movie IDs
    watchlist_movie_ids = Column(JSON, default=[])  # Store list of watchlist movie IDs


engine = create_engine(Config.SQLALCHEMY_DATABASE_URI)

Base.metadata.create_all(engine)

Session = sessionmaker(bind=engine)

session = Session()

session.commit()
