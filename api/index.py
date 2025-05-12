import os
from flask import Flask, request, jsonify, make_response
from flask_login import LoginManager, login_user, login_required, logout_user, current_user, UserMixin
from flask_cors import CORS

from passlib.hash import bcrypt

import sqlite3
from sqlite3 import Error

from base64 import b64encode
import random

from dotenv import load_dotenv
load_dotenv()

import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


app = Flask(__name__)

# Read environment variable
app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY', 'default-fallback')
db_path = os.environ.get('DATABASE_URL', 'fallback.db')
DB_PATH = os.environ.get("DATABASE_URL", "api/database.sqlite")

# app.secret_key = 'muchSecretVeryKey'

login_manager = LoginManager()
login_manager.init_app(app)
login_manager.login_view = 'login'

from urllib.parse import urlparse

from urllib.parse import urlparse

def is_vercel_origin(origin):
    try:
        parsed = urlparse(origin)
        return parsed.netloc.endswith(".vercel.app")
    except:
        return False

# CORS(app, supports_credentials=True, origins=[is_vercel_origin, 'https://localhost:5173'])
# CORS(app, supports_credentials=True, origins=is_vercel_origin)
CORS(app, resources={r"/*": {"origins": "https://cse108finalproject.vercel.app"}}, supports_credentials=True)



DB_FILE = "database.sqlite"

class User(UserMixin):
    def __init__(self, id, username, password):
        self.id = id
        self.username = username
        self.password = password

    @staticmethod
    def get_by_username(username):
        
        db_path = os.environ.get("DATABASE_URL", "api/database.sqlite")
        conn = sqlite3.connect(db_path)
        cursor = conn.cursor()
        cursor.execute("SELECT u_userId, u_username, u_password FROM user WHERE u_username = ?", (username,))
        row = cursor.fetchone()
        cursor.close()
        conn.close()
        return row
        conn = openConnection(DB_FILE)
        cursor = conn.cursor()
        cursor.execute("SELECT u_userId, u_username, u_password FROM user WHERE u_username = ?", (username,))
        row = cursor.fetchone()
        cursor.close()
        closeConnection(conn, DB_FILE)

        if row:
            return User(id=row[0], username=row[1], password=row[2])
        return None

    @staticmethod
    def get(user_id):
        conn = openConnection(DB_FILE)
        cursor = conn.cursor()
        cursor.execute("SELECT u_userId, u_username, u_password FROM user WHERE u_userId = ?", (user_id,))
        row = cursor.fetchone()
        cursor.close()
        closeConnection(conn, DB_FILE)

        if row:
            return User(id=row[0], username=row[1], password=row[2])
        return None

@login_manager.user_loader
def load_user(user_id):
    return User.get(user_id)

@app.route('/logout')
@login_required
def logout():
    logout_user()
    return jsonify({'message': 'Logged out'}), 200

# Functions for connecting to database
def openConnection(_dbFile):
    conn = None
    try:
        conn = sqlite3.connect(_dbFile)
        print("successfully opened connection")
    except Error as e:
        print(e)

    return conn

# Function for closing database connection
def closeConnection(_conn, _dbFile):
    
    try:
        _conn.close()
        print("successfully closed connection")
    except Error as e:
        print(e)
        
        
@app.route("/ping")
def ping():
    logger.info("Ping route was called")
    return {"status": "ok"}



@app.route("/register", methods=["POST"])
def register():
    try:
        data = request.get_json()
        logger.info("Received data: %s", data)

        username = data.get("username")
        password = data.get("password")
        first_name = data.get("firstName")
        last_name = data.get("lastName")

        if not username or not password:
            logger.warning("Missing username or password")
            return jsonify({"error": "Username and password required"}), 400

        hashed_password = bcrypt.hash(password)
        logger.info("Password hashed successfully")

        conn = sqlite3.connect(DB_PATH)
        cursor = conn.cursor()

        cursor.execute('''
            INSERT INTO user (u_username, u_password, u_firstName, u_lastName)
            VALUES (?, ?, ?, ?)
        ''', (username, hashed_password, first_name, last_name))

        conn.commit()
        cursor.close()
        conn.close()

        logger.info("✅ User registered successfully")
        return jsonify({"message": "User registered successfully"}), 201

    except Exception as e:
        logger.error("🔥 Registration error: %s", repr(e))
        return jsonify({"error": str(e)}), 500


# Create a new user
# @app.route('/register', methods=['POST'])
# def register():
#     data = request.json

#     # Extract data
#     username = data.get('username')
#     password = data.get('password')
#     first_name = data.get('firstName')
#     last_name = data.get('lastName')

#     if not username or not password:
#         return jsonify({'error': 'Username and password are required'}), 400

#     # Hash the password
#     hashed_password = bcrypt.hash(password)
#     bcrypt.verify(password, hashed_password)

#     try:
#         conn = openConnection(DB_FILE)
#         cursor = conn.cursor()

#         query = '''
#             INSERT INTO user (u_username, u_password, u_firstName, u_lastName)
#             VALUES (?, ?, ?, ?)
#         '''
#         values = (username, hashed_password, first_name, last_name)
#         cursor.execute(query, values)
#         conn.commit()

#         return jsonify({'message': 'User registered successfully'}), 201

#     except sqlite3.Error as err:
#         return jsonify({'error': str(err)}), 500

#     finally:
#         if cursor:
#             cursor.close()
#         closeConnection(conn, DB_FILE)

@app.route('/login', methods=['POST'])
def login():
    data = request.json
    username = data.get('username')
    password = data.get('password')

    user = User.get_by_username(username)
    if user and bcrypt.verify(password, user.password):
        login_user(user)
        return jsonify({'message': 'Login successful'}), 200
    return jsonify({'error': 'Invalid username or password'}), 401

@app.route('/upload', methods=['POST'])
@login_required
def upload():
    image_file = request.files['image']
    description = request.form.get('description')
    user_id = current_user.id
    
    if image_file:
        conn = openConnection(DB_FILE)
        cursor = conn.cursor()
        
        image_data = image_file.read()
        
        print("Post description: ", description)
        
        # Create post in database
        cursor.execute('INSERT INTO userPosts (up_userId, up_body) VALUES (?, ?)',
                  (user_id, description))
        post_id = cursor.lastrowid
        
        print("Post id: ", post_id)
        
        # Upload image to database
        cursor.execute('INSERT INTO images (i_userId, i_postId, i_image) VALUES (?, ?, ?)',
                  (user_id, post_id, image_data))
        
        # Increment post count
        cursor.execute(
            'UPDATE user SET u_postCnt = u_postCnt + 1 WHERE u_userId = ?',
            (user_id,)
        )
        conn.commit()
        closeConnection(conn, DB_FILE)
        return 'Image uploaded successfully', 200

    return 'No image uploaded', 400

@app.route('/check-auth', methods=['GET'])
def check_auth():
    if current_user.is_authenticated:
        return jsonify({'authenticated': True, 'username': current_user.username}), 200
    return jsonify({'authenticated': False}), 401

@app.route('/getInfo', methods=['POST'])
@login_required
def getUserData():
    try:
        conn = openConnection(DB_FILE)
        cursor = conn.cursor()
        
        user_id = current_user.id
        
        query = ''' SELECT u_username, u_firstName, u_lastName, u_bio, u_followerCnt, u_followingCnt, u_postCnt
                        FROM user WHERE u_userId = ?;'''
        values = (user_id,)
        cursor.execute(query, values)
        data = cursor.fetchone()
        
        # Get profile picture
        cursor.execute('''
            SELECT pp_image FROM profilePictures WHERE pp_userId = ?
        ''', (user_id,))
        image_row = cursor.fetchone()
        
        # Store profile picture
        profile_image = None
        if image_row and image_row[0]:
            from base64 import b64encode
            profile_image = b64encode(image_row[0]).decode('utf-8')
        
        print(data)
        
        closeConnection(conn, DB_FILE)
        
        return jsonify({'data': data, 'profileImage': profile_image})
    except sqlite3.Error as err:
        return jsonify({'error': str(err)}), 500

@app.route('/updateBio', methods=['POST'])
@login_required
def update_bio():
    try:
        data = request.json
        new_bio = data.get('bio')
        user_id = current_user.id

        conn = openConnection(DB_FILE)
        cursor = conn.cursor()
        
        # Change user bio in database
        cursor.execute('UPDATE user SET u_bio = ? WHERE u_userId = ?', (new_bio, user_id))
        conn.commit()

        cursor.close()
        closeConnection(conn, DB_FILE)

        return jsonify({'message': 'Bio updated successfully'}), 200

    except sqlite3.Error as err:
        return jsonify({'error': str(err)}), 500

@app.route('/getPosts', methods=['POST'])
@login_required
def getPosts():
    try:
        data = request.get_json()
        username = data.get('username', None)

        conn = openConnection(DB_FILE)
        cursor = conn.cursor()

        # Get user_id based on input or current_user
        if username:
            cursor.execute("SELECT u_userId FROM user WHERE u_username = ?", (username,))
            result = cursor.fetchone()
            if not result:
                closeConnection(conn, DB_FILE)
                return jsonify({'error': 'User not found'}), 404
            user_id = result[0]
        else:
            user_id = current_user.id

        # Query posts and images for the selected user_id
        query = '''
            SELECT i.i_image, up.up_body, up.up_likeCnt
                FROM images i
                JOIN userPosts up ON i.i_postId = up.up_postId
                WHERE i.i_userId = ?
        '''
        cursor.execute(query, (user_id,))
        posts = cursor.fetchall()

        # Convert binary image data to base64 strings
        post_data = [
            {
                'image': b64encode(row[0]).decode('utf-8'),
                'description': row[1],
                'likeCnt': row[2]
            } for row in posts
        ]

        # Return list of posts by user
        closeConnection(conn, DB_FILE)
        return jsonify({'posts': post_data}), 200

    except sqlite3.Error as err:
        return jsonify({'error': str(err)}), 500

@app.route('/uploadProfilePicture', methods=['POST'])
@login_required
def upload_profile_picture():
    # Get image and user id
    image_file = request.files.get('image')
    user_id = current_user.id

    if not image_file:
        return jsonify({'error': 'No image provided'}), 400

    image_data = image_file.read()
    try:
        conn = openConnection(DB_FILE)
        cursor = conn.cursor()

        # Replace existing image if one exists, insert new image if one doesn't
        cursor.execute('''
            INSERT INTO profilePictures (pp_userId, pp_image)
            VALUES (?, ?)
            ON CONFLICT(pp_userId) DO UPDATE SET pp_image=excluded.pp_image;
        ''', (user_id, image_data))

        conn.commit()
        cursor.close()
        closeConnection(conn, DB_FILE)

        return jsonify({'message': 'Profile picture uploaded successfully'}), 200

    except sqlite3.Error as err:
        return jsonify({'error': str(err)}), 500
      
@app.route('/getRandomPosts', methods=['POST'])
@login_required
def getRandomPosts():
    try:
        conn = openConnection(DB_FILE)
        cursor = conn.cursor()
        
        query = '''SELECT up_postId FROM userPosts'''
        cursor.execute(query)
        
        post_list = cursor.fetchall()
        post_ids = [row[0] for row in post_list]
        
        # Get 12 or less random posts
        shuffled_ids = random.sample(post_ids, min(12, len(post_ids)))
        posts = []
        
        # Collect post information for each post in post_id
        for post_id in shuffled_ids:
            cursor.execute('''
                SELECT i.i_image, up.up_body, up.up_likeCnt,
                    EXISTS (
                        SELECT 1 FROM postLikes pl
                        WHERE pl.pl_userId = ? AND pl.pl_postId = up.up_postId
                    ) AS liked
                FROM images i
                JOIN userPosts up ON i.i_postId = up.up_postId
                WHERE up.up_postId = ?
                LIMIT 1
            ''', (current_user.id, post_id))

            row = cursor.fetchone()
            if row:
                posts.append({
                    'postId': post_id,
                    'image': b64encode(row[0]).decode('utf-8'),
                    'description': row[1],
                    'likeCnt': row[2],
                    'liked': bool(row[3])
                })

        # Return list of row information
        closeConnection(conn, DB_FILE)
        return jsonify({'posts': posts}), 200
        
    except sqlite3.Error as err:
        return jsonify({'error': str(err)}), 500

@app.route('/toggleLike', methods=['POST'])
@login_required
def toggle_like():
    try:
        data = request.get_json()
        post_id = data.get('postId')
        user_id = current_user.id

        if post_id is None:
            return jsonify({'error': 'Missing postId'}), 400

        conn = openConnection(DB_FILE)
        cursor = conn.cursor()

        # Check if user already liked this post
        cursor.execute('''
            SELECT 1 FROM postLikes WHERE pl_userId = ? AND pl_postId = ?
        ''', (user_id, post_id))
        already_liked = cursor.fetchone()

        if already_liked:
            # Unlike
            cursor.execute('DELETE FROM postLikes WHERE pl_userId = ? AND pl_postId = ?', (user_id, post_id))
            cursor.execute('UPDATE userPosts SET up_likeCnt = up_likeCnt - 1 WHERE up_postId = ? AND up_likeCnt > 0', (post_id,))
            new_state = False
        else:
            # Like
            cursor.execute('INSERT INTO postLikes (pl_userId, pl_postId) VALUES (?, ?)', (user_id, post_id))
            cursor.execute('UPDATE userPosts SET up_likeCnt = up_likeCnt + 1 WHERE up_postId = ?', (post_id,))
            new_state = True

        conn.commit()
        closeConnection(conn, DB_FILE)
        return jsonify({'liked': new_state}), 200

    except sqlite3.Error as err:
        return jsonify({'error': str(err)}), 500


#========
@app.route('/searchUsers', methods=['POST'])
@login_required
def search_users():
    data = request.get_json()
    search_term = data.get('query', '').strip()

    if not search_term:
        return jsonify({'results': []}), 200

    conn = openConnection(DB_FILE)
    cursor = conn.cursor()
    
    query = '''
        SELECT u.u_userId, u.u_username, pp.pp_image,
               EXISTS (
                   SELECT 1 FROM follows f
                   WHERE f.f_userId = ? AND f.f_followingId = u.u_userId
               ) AS is_following
        FROM user u
        LEFT JOIN profilePictures pp ON u.u_userId = pp.pp_userId
        WHERE u.u_username LIKE ?
          AND u.u_userId != ?
    '''
    cursor.execute(query, (current_user.id, f'%{search_term}%', current_user.id))
    rows = cursor.fetchall()
    
    results = []
    for user_id, username, image, is_following in rows:
        profile_image = b64encode(image).decode('utf-8') if image else None
        results.append({
            'userId': user_id,
            'username': username,
            'profileImage': profile_image,
            'isFollowing': bool(is_following)
        })

    cursor.close()
    closeConnection(conn, DB_FILE)
    return jsonify({'results': results}), 200

@app.route('/follow', methods=['POST'])
@login_required
def follow():
    data = request.get_json()
    target_id = data.get('targetId')

    conn = openConnection(DB_FILE)
    cursor = conn.cursor()
    try:
        cursor.execute('INSERT INTO follows (f_userId, f_followingId) VALUES (?, ?)', (current_user.id, target_id))
        cursor.execute('UPDATE user SET u_followerCnt = u_followerCnt + 1 WHERE u_userId = ?', (target_id,))
        cursor.execute('UPDATE user SET u_followingCnt = u_followingCnt + 1 WHERE u_userId = ?', (current_user.id,))
        conn.commit()
        return jsonify({'status': 'followed'}), 200
    except sqlite3.IntegrityError:
        return jsonify({'error': 'Already following'}), 400
    finally:
        cursor.close()
        closeConnection(conn, DB_FILE)

@app.route('/unfollow', methods=['POST'])
@login_required
def unfollow():
    data = request.get_json()
    target_id = data.get('targetId')

    conn = openConnection(DB_FILE)
    cursor = conn.cursor()
    cursor.execute('DELETE FROM follows WHERE f_userId = ? AND f_followingId = ?', (current_user.id, target_id))
    cursor.execute('UPDATE user SET u_followerCnt = u_followerCnt - 1 WHERE u_userId = ? AND u_followerCnt > 0', (target_id,))
    cursor.execute('UPDATE user SET u_followingCnt = u_followingCnt - 1 WHERE u_userId = ? AND u_followingCnt > 0', (current_user.id,))
    conn.commit()
    cursor.close()
    closeConnection(conn, DB_FILE)
    return jsonify({'status': 'unfollowed'}), 200

if __name__ == '__main__':
    # app.run(debug=True)
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port, debug=True)