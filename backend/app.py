from flask import Flask, request, jsonify, flash, redirect, url_for
from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt
from flask_login import LoginManager, UserMixin, login_user, current_user, logout_user, login_required
from flask_cors import CORS
from config import Config
from flask import Response

from werkzeug.security import generate_password_hash, check_password_hash

from sqlalchemy import not_, desc, JSON


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
    favorite_movie_ids = db.Column(JSON)  # Store list of favorite movie IDs
    watchlist_movie_ids = db.Column(JSON)


    def get_id(self):
        return self.user_id

    def __repr__(self):
        return f"User('{self.first_name}', '{self.last_name}', '{self.email}')"
    
    

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
    users = Users(first_name = data['first_name'], last_name = data['last_name'], email = data['email'], password_hash = hashed_password)
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
    
@app.route("/atf", methods=['POST'])
def add_to_fav():
    data = request.get_json()
    user = Users.query.filter_by(email=data['user_email']).first()

    if user:
        movie_id = data['movie_id']
        
        # Check if movie is already in favorites
        if movie_id not in user.favorite_movie_ids:
            user.favorite_movie_ids.append(movie_id)
            db.session.commit()  # Save the updated list to the database
            return jsonify({"message": "Movie added to favorites"}), 200
        else:
            return jsonify({"message": "Movie is already in favorites"}), 400
    else:
        return jsonify({"message": "User not found"}), 404


@app.route("/rff", methods=['POST'])
def remove_from_fav():
    data = request.get_json()
    user = Users.query.filter_by(email=data['user_email']).first()

    if user:
        movie_id = data['movie_id']
        
        # Check if movie is in favorites
        if movie_id in user.favorite_movie_ids:
            user.favorite_movie_ids.remove(movie_id)
            db.session.commit()  # Save the updated list to the database
            return jsonify({"message": "Movie removed from favorites"}), 200
        else:
            return jsonify({"message": "Movie not found in favorites"}), 400
    else:
        return jsonify({"message": "User not found"}), 404


@app.route("/atwl", methods=['POST'])
def add_to_watchlist():
    data = request.get_json()
    user = Users.query.filter_by(email=data['user_email']).first()

    if user:
        movie_id = data['movie_id']
        
        # Check if movie is already in watchlist
        if movie_id not in user.watchlist_movie_ids:
            user.watchlist_movie_ids.append(movie_id)
            db.session.commit()  # Save the updated list to the database
            return jsonify({"message": "Movie added to watchlist"}), 200
        else:
            return jsonify({"message": "Movie is already in watchlist"}), 400
    else:
        return jsonify({"message": "User not found"}), 404


@app.route("/rfwl", methods=['POST'])
def remove_from_watchlist():
    data = request.get_json()
    user = Users.query.filter_by(email=data['user_email']).first()

    if user:
        movie_id = data['movie_id']
        
        # Check if movie is in watchlist
        if movie_id in user.watchlist_movie_ids:
            user.watchlist_movie_ids.remove(movie_id)
            db.session.commit()  # Save the updated list to the database
            return jsonify({"message": "Movie removed from watchlist"}), 200
        else:
            return jsonify({"message": "Movie not found in watchlist"}), 400
    else:
        return jsonify({"message": "User not found"}), 404

    


if __name__ == '__main__':
    app.run(debug= True, port=9000)