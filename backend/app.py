from flask import Flask, request, jsonify, flash, redirect, url_for
from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt
from flask_login import LoginManager, UserMixin, login_user, current_user, logout_user, login_required
from flask_cors import CORS
from config import Config
from flask import Response

from werkzeug.security import generate_password_hash, check_password_hash

from sqlalchemy import not_, desc


app = Flask(__name__)
app.config.from_object(Config)
db = SQLAlchemy(app)
bcrypt = Bcrypt(app)
login_manager = LoginManager(app)
login_manager.login_view = 'login'
login_manager.login_message_category = 'info'
CORS(app)

@app.before_request
def basic_authentication():
    if request.method.lower() == 'options':
        return Response()

class Users(db.Model, UserMixin):
    __tablename__ = 'users'
    user_id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(255), nullable=False)
    password_hash = db.Column(db.String(255), nullable=False)
    first_name = db.Column(db.String(255), nullable=False)
    last_name = db.Column(db.String(255), nullable=False)
    favourite_movies = db.relationship("FavoriteMovie", back_populates="user", cascade="all, delete-orphan")
    watchlist_movies = db.relationship("WatchlistMovie", back_populates="user", cascade="all, delete-orphan")


    def get_id(self):
        return self.user_id

    def __repr__(self):
        return f"User('{self.first_name}', '{self.last_name}', '{self.email}')"
    
class FavoriteMovie(db.Model, UserMixin):
    __tablename__ = 'favorite_movies'
    fav_id = db.Column(db.Integer, primary_key=True)
    
    tmdb_movie_id = db.Column(db.String(255), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('users.user_id'), nullable=False)

    # Relationship back to the user
    user = db.relationship("Users", back_populates="favourite_movies")

    def __repr__(self):
        return f"FavoriteMovie('{self.tmdb_movie_id}', user_id={self.user_id})"
    
    
class WatchlistMovie(db.Model, UserMixin):
    __tablename__ = 'watchlist_movies'
    watchlist_id = db.Column(db.Integer, primary_key=True)
    tmdb_movie_id = db.Column(db.String(255), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('users.user_id'), nullable=False)

    # Relationship back to the user
    user = db.relationship("Users", back_populates="watchlist_movies")

    def __repr__(self):
        return f"WatchlistMovie('{self.tmdb_movie_id}', user_id={self.user_id})"
    

@login_manager.user_loader
def load_user(user_id):
    return Users.query.get(int(user_id))


@app.route("/register", methods = ['POST'])
def register():
    data = request.get_json()
    user = Users.query.filter_by(email = data['email']).first()
    if(user):
        return jsonify({"message": "User with this Email already exists"}), 201
    hashed_password = generate_password_hash(data['password'], method='pbkdf2:sha256')
    users = Users(first_name = data['first_name'], last_name = data['last_name'], phone_no = data['phone_num'], email = data['email'], password_hash = hashed_password)
    db.session.add(users)
    db.session.commit()
    return jsonify({"message": "User registered successfully"}), 201
    
@app.route("/login", methods=['POST'])
def login():
    data = request.get_json()
    user = Users.query.filter_by(email = data['email']).first()
    if user.password_hash and check_password_hash(user.password_hash, data['password']):
        login_user(user, remember=data.get('remember', False))
        return jsonify({"message": "Login successful"}), 200
    else:
        return jsonify({"message": "Login Unsuccessful. Please check email and password"}), 401


if __name__ == '__main__':
    app.run(debug= True, port=9000)