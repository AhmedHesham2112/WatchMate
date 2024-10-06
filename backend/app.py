from flask import Flask, request, jsonify, flash, redirect, url_for
from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt
from flask_login import LoginManager, UserMixin, login_user, current_user, logout_user, login_required
from flask_cors import CORS
from config import Config
from flask import Response
from flask_jwt_extended import JWTManager, create_access_token, create_refresh_token, jwt_required, get_jwt_identity
from datetime import timedelta

from werkzeug.security import generate_password_hash, check_password_hash

from sqlalchemy import not_, desc, JSON
from sqlalchemy.ext.mutable import MutableList


app = Flask(__name__)
app.config['SECRET_KEY'] = 'your-secret-key'
app.config['JWT_SECRET_KEY'] = 'your-jwt-secret-key'
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(hours=1)  # Set token expiry
app.config.from_object(Config)
jwt = JWTManager(app)
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
    favorite_movie_ids = db.Column(MutableList.as_mutable(JSON), default=[])  # Store list of favorite movie IDs
    watchlist_movie_ids = db.Column(MutableList.as_mutable(JSON), default=[])


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
        access_token = create_access_token(identity=user.email)
        refresh_token = create_refresh_token(identity=user.email)
        # login_user(user, remember=data.get('remember', False))
        return jsonify({"message": "Login successful",
                        "access_token": access_token,
                        "refresh_token": refresh_token}), 200
    else:
        return jsonify({"message": "Login Unsuccessful. Please check email and password"}), 401

# Route to refresh the token
@app.route('/refresh', methods=['POST'])
@jwt_required(refresh=True)
def refresh():
    current_user_id = get_jwt_identity()
    new_access_token = create_access_token(identity=current_user_id)
    return jsonify(access_token=new_access_token)
    
@app.route("/atf", methods=['POST'])
@jwt_required()
def add_to_fav():
    data = request.get_json()
    user_email = get_jwt_identity()
    user = Users.query.filter_by(email=user_email).first()

    if user:
        if user.favorite_movie_ids is None:
            user.favorite_movie_ids = []
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
@jwt_required()

def remove_from_fav():
    data = request.get_json()
    user_email = get_jwt_identity()
    user = Users.query.filter_by(email=user_email).first()

    if user:
        if user.favorite_movie_ids is None:
            user.favorite_movie_ids = []
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
@jwt_required()
def add_to_watchlist():
    data = request.get_json()
    user_email = get_jwt_identity()
    user = Users.query.filter_by(email=user_email).first()

    if user:
        if user.watchlist_movie_ids is None:
            user.watchlist_movie_ids = []
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
@jwt_required()
def remove_from_watchlist():
    data = request.get_json()
    user_email = get_jwt_identity()

    user = Users.query.filter_by(email=user_email).first()

    if user:
        if user.watchlist_movie_ids is None:
            user.watchlist_movie_ids = []
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

@app.route("/gf", methods=['GET'])
@jwt_required()
def get_fav():
    user_email = get_jwt_identity()
    user = Users.query.filter_by(email=user_email).first()

    if user:
        if (user.favorite_movie_ids is None) or (len(user.favorite_movie_ids) == 0):
            user.favorite_movie_ids = []
            return jsonify({"message": "Failure"}), 200

        return jsonify({"message": "Success", "result" : user.favorite_movie_ids}), 200
        
    else:
        return jsonify({"message": "User not found"}), 404
    
@app.route("/gwl", methods=['GET'])
@jwt_required()
def get_watchlist():
    user_email = get_jwt_identity()
    user = Users.query.filter_by(email=user_email).first()

    if user:
        if (user.watchlist_movie_ids is None) or (len(user.watchlist_movie_ids) == 0):
            user.watchlist_movie_ids = []
            return jsonify({"message": "Failure"}), 200

        return jsonify({"message": "Success", "result" : user.watchlist_movie_ids}), 200
        
    else:
        return jsonify({"message": "User not found"}), 404


if __name__ == '__main__':
    app.run(debug= True, port=9000)