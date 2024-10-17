from flask import Flask, request, jsonify, flash, redirect, url_for, render_template, send_from_directory
from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt
from flask_login import LoginManager, UserMixin, login_user, current_user, logout_user, login_required
from flask_cors import CORS
from config import Config
from flask import Response
from flask_jwt_extended import JWTManager, create_access_token, create_refresh_token, jwt_required, get_jwt_identity
from datetime import timedelta
import os
from flask import render_template_string
from collections import Counter
from sendgrid import SendGridAPIClient
from sendgrid.helpers.mail import Mail
from werkzeug.security import generate_password_hash, check_password_hash
#from flask_mail import Mail, Message
from itsdangerous import URLSafeTimedSerializer, SignatureExpired
from sqlalchemy import not_, desc, JSON
from sqlalchemy.ext.mutable import MutableList
from dotenv import load_dotenv
load_dotenv(dotenv_path='../.env')

app = Flask(__name__,static_folder="../dist/static", template_folder="../dist")
app.config.from_object(Config)
jwt = JWTManager(app)
db = SQLAlchemy(app)
bcrypt = Bcrypt(app)
#mail = Mail(app)
s = URLSafeTimedSerializer(app.config['SECRET_KEY'])
login_manager = LoginManager(app)
login_manager.login_view = 'login'
login_manager.login_message_category = 'info'
print(app.config['SECRET_KEY'])
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
    verified = db.Column(db.Boolean, default=False)
    favorite_movie_ids = db.Column(MutableList.as_mutable(JSON), default=[])  # Store list of favorite movie IDs
    watchlist_movie_ids = db.Column(MutableList.as_mutable(JSON), default=[])


    def get_id(self):
        return self.user_id

    def __repr__(self):
        return f"User('{self.first_name}', '{self.last_name}', '{self.email}')"
    
    

@login_manager.user_loader
def load_user(user_id):
    return Users.query.get(int(user_id))
@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def catch_all(path):
    return render_template("index.html")

@app.route("/register", methods = ['POST'])
def register():
    data = request.get_json()
    user = Users.query.filter_by(email = data['email']).first()
    if(user):
        return jsonify({"message": "User with this Email already exists"}), 201
    token = s.dumps(data['email'], salt='email-confirm')
    confirm_url = f"{app.config['BASE_URL']}{url_for('confirm_email', token=token)}"
    message = Mail(
    from_email=app.config['MAIL_DEFAULT_SENDER'],
    to_emails=data['email'],
    subject='Sending with Twilio SendGrid is Fun',
    html_content="<strong>Hello "+data['first_name']+",\n\n Please confirm your email by clicking on the following link: {confirm_url}'</strong>")
    sg = SendGridAPIClient(app.config['MAIL_PASSWORD'])
    response = sg.send(message)
    print(response.status_code)
    print(response.body)
    print(response.headers)
    hashed_password = generate_password_hash(data['password'], method='pbkdf2:sha256')
    users = Users(first_name = data['first_name'], last_name = data['last_name'], email = data['email'], password_hash = hashed_password, verified = False)
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
        return jsonify({"message": "Login successful",
                        "access_token": access_token,
                        "refresh_token": refresh_token}), 200
    else:
        return jsonify({"message": "Login Unsuccessful. Please check email and password"}), 401

@app.route('/resend_confirmation', methods=['POST'])
@jwt_required()    

def resend_confirmation():
    user_email = get_jwt_identity()
    user = Users.query.filter_by(email=user_email).first()

    if user and not user.verified:
        token = s.dumps(user.email, salt='email-confirm')
        confirm_url = f"{app.config['BASE_URL']}{url_for('confirm_email', token=token)}"
        msg = Message('Account Confirmation Email', recipients=[user_email])
        msg.body = f"Hello {user.first_name},\n\n Please confirm your email by clicking on the following link: {confirm_url}"
        mail.send(msg)
        return jsonify({"message": "Confirmation email resent."}), 200

    return jsonify({"message": "User not found or already verified."}), 404

@app.route('/confirm_email_gate/<token>')
def confirm_email(token):
    try:
        # Verify the token and get the user's email
        email = s.loads(token, salt='email-confirm', max_age=3600)  # Token valid for 1 hour
    except SignatureExpired:
        return jsonify({"message": "The confirmation link has expired."}), 400

    # Find the user with the corresponding email
    user = Users.query.filter_by(email=email).first_or_404()

    # Mark the user as verified
    if user.verified:
        return jsonify({"message": "Account already confirmed."}), 200
    else:
        user.verified = True
        db.session.commit()
        return jsonify({"message": "You have confirmed your account. Thank you!"}), 200



# Route to refresh the token
@app.route('/refresh', methods=['POST'])
@jwt_required(refresh=True)
def refresh():
    current_user_id = get_jwt_identity()
    new_access_token = create_access_token(identity=current_user_id)
    return jsonify({'access_token':new_access_token}), 200
    
@app.route("/atf", methods=['POST'])
@jwt_required()
def add_to_fav():
    data = request.get_json()
    user_email = get_jwt_identity()
    user = Users.query.filter_by(email=user_email).first()
    if user:
        if user.verified == 0:
            return jsonify({"message": "User not verified"}), 200
        if user.favorite_movie_ids is None:
            user.favorite_movie_ids = []
        movie_id = data['movie_id']
        movie_genres = data['movie_genre']
        movie_data = [movie_id,movie_genres]
        
        
        # Check if movie is already in favorites
        if movie_id not in user.favorite_movie_ids:
            user.favorite_movie_ids.append(movie_data)
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
        if user.verified == 0:
            return jsonify({"message": "User not verified"}), 200
        if user.favorite_movie_ids is None:
            user.favorite_movie_ids = []
        movie_id = data['movie_id']
        updated_movie_ids = [movie for movie in user.favorite_movie_ids if movie[0] != movie_id]

        # Check if movie is in favorites
        if len(user.favorite_movie_ids) >len(updated_movie_ids):
            user.favorite_movie_ids = updated_movie_ids
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
        if user.verified == 0:
            return jsonify({"message": "User not verified"}), 200
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
        if user.verified == 0:
            return jsonify({"message": "User not verified"}), 200
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
        if user.verified == 0:
            return jsonify({"message": "User not verified"}), 200
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
        if user.verified == 0:
            return jsonify({"message": "User not verified"}), 200
        elif (user.watchlist_movie_ids is None) or (len(user.watchlist_movie_ids) == 0):
            user.watchlist_movie_ids = []
            return jsonify({"message": "Failure"}), 200

        return jsonify({"message": "Success", "result" : user.watchlist_movie_ids}), 200
        
    else:
        return jsonify({"message": "User not found"}), 404
    
@app.route("/gr", methods=['GET'])
@jwt_required()
def get_recommendations():
    user_email = get_jwt_identity()
    user = Users.query.filter_by(email=user_email).first()
    
    if user:
        if user.verified == 0:
            return jsonify({"message": "User not verified"}), 200
        elif (user.favorite_movie_ids is None) or (len(user.favorite_movie_ids) == 0):
            user.favorite_movie_ids = []
            return jsonify({"message": "User doesn't have any saved movies"}), 200
        elif len(user.favorite_movie_ids) > 0:
            all_numbers = [num for _, inner_list in user.favorite_movie_ids for num in inner_list]
            counter = Counter(all_numbers)
            most_common_two = [item for item, _ in counter.most_common(2)]
            return jsonify({"message": "Success", "result" : most_common_two}), 200
    else:
        return jsonify({"message": "User not found"}), 404
    
if __name__ == '__main__':
    app.run(debug= True, port=9000)