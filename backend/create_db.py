from sqlalchemy import Column, Integer, String, ForeignKey, Table, UniqueConstraint
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
    favorites = relationship("FavoriteMovie", back_populates="user", cascade="all, delete-orphan")
    watchlist = relationship("WatchlistMovie", back_populates="user", cascade="all, delete-orphan")


# FavoriteMovie model
class FavoriteMovie(Base):
    __tablename__ = 'favorite_movies'
    
    id = Column(Integer, primary_key=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey('users.user_id'), nullable=False)
    tmdb_movie_id = Column(Integer, nullable=False)  # TMDb movie ID

    # Relationship with user
    user = relationship("User", back_populates="favorites")
    
    # Ensure that each user can only favorite a specific movie once
    __table_args__ = (UniqueConstraint('user_id', 'tmdb_movie_id', name='user_favorite_uc'),)

    def __repr__(self):
        return f"<FavoriteMovie(user_id={self.user_id}, tmdb_movie_id={self.tmdb_movie_id})>"

# WatchlistMovie model
class WatchlistMovie(Base):
    __tablename__ = 'watchlist_movies'
    
    id = Column(Integer, primary_key=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey('users.user_id'), nullable=False)
    tmdb_movie_id = Column(Integer, nullable=False)  # TMDb movie ID

    # Relationship with user
    user = relationship("User", back_populates="watchlist")
    
    # Ensure that each user can only add a specific movie to watchlist once
    __table_args__ = (UniqueConstraint('user_id', 'tmdb_movie_id', name='user_watchlist_uc'),)

    def __repr__(self):
        return f"<WatchlistMovie(user_id={self.user_id}, tmdb_movie_id={self.tmdb_movie_id})>"
    


engine = create_engine(Config.SQLALCHEMY_DATABASE_URI)

Base.metadata.create_all(engine)

Session = sessionmaker(bind=engine)

session = Session()

session.commit()
