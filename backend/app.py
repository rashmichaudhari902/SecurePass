# app.py — Main Flask Server for SecurePass

from flask import Flask, request, jsonify
from flask_cors import CORS
import hashlib

from generator import PasswordGenerator
from strength import PasswordStrengthAnalyzer
from history import PasswordHistoryList
from undo_stack import PasswordStack
from db.db_connect import execute_query, call_procedure

app = Flask(__name__)
CORS(app)

# In-memory stack per user session
undo_stacks = {}

def hash_password(password):
    return hashlib.sha256(password.encode()).hexdigest()

# ============================================================
# AUTH ROUTES
# ============================================================

@app.route("/api/register", methods=["POST"])
def register():
    data     = request.json
    username = data.get("username")
    password = data.get("master_password")

    if not username or not password:
        return jsonify({"error": "Username and password required"}), 400

    hashed = hash_password(password)

    try:
        execute_query(
            "INSERT INTO users (username, master_hash) VALUES (%s, %s)",
            (username, hashed)
        )
        return jsonify({"message": "User registered successfully!"}), 201
    except:
        return jsonify({"error": "Username already exists!"}), 409


@app.route("/api/login", methods=["POST"])
def login():
    data     = request.json
    username = data.get("username")
    password = data.get("master_password")

    hashed = hash_password(password)
    rows   = execute_query(
        "SELECT id FROM users WHERE username=%s AND master_hash=%s",
        (username, hashed),
        fetch=True
    )

    if rows:
        return jsonify({"message": "Login successful!", "user_id": rows[0]["id"]}), 200
    return jsonify({"error": "Invalid username or password!"}), 401


# ============================================================
# PASSWORD ROUTES
# ============================================================

@app.route("/api/generate", methods=["POST"])
def generate():
    data    = request.json
    user_id = data.get("user_id")
    rules   = data.get("rules", {})

    generator = PasswordGenerator(rules)
    password  = generator.generate()

    analyzer = PasswordStrengthAnalyzer()
    strength = analyzer.analyze(password)

    # Push to undo stack
    if user_id not in undo_stacks:
        undo_stacks[user_id] = PasswordStack()
    undo_stacks[user_id].push(password)

    return jsonify({
        "password": password,
        "strength": strength
    }), 200


@app.route("/api/undo", methods=["POST"])
def undo():
    data    = request.json
    user_id = data.get("user_id")

    if user_id not in undo_stacks:
        return jsonify({"error": "Nothing to undo!"}), 400

    # Pop current
    undo_stacks[user_id].pop()

    # Peek previous
    previous = undo_stacks[user_id].peek()

    if previous is None:
        return jsonify({"error": "No previous password!"}), 400

    analyzer = PasswordStrengthAnalyzer()
    strength = analyzer.analyze(previous)

    return jsonify({
        "password": previous,
        "strength": strength
    }), 200


@app.route("/api/save", methods=["POST"])
def save_password():
    data     = request.json
    user_id  = data.get("user_id")
    site     = data.get("site")
    password = data.get("password")

    if not all([user_id, site, password]):
        return jsonify({"error": "Missing fields!"}), 400

    execute_query(
        """INSERT INTO passwords (user_id, site, password)
           VALUES (%s, %s, %s)
           ON DUPLICATE KEY UPDATE password=%s, updated_at=NOW()""",
        (user_id, site, password, password)
    )

    return jsonify({"message": "Password saved!"}), 200


@app.route("/api/passwords/<int:user_id>", methods=["GET"])
def get_passwords(user_id):
    rows = execute_query(
        "SELECT site, password, updated_at FROM passwords WHERE user_id=%s",
        (user_id,),
        fetch=True
    )
    return jsonify(rows), 200


@app.route("/api/history/<int:user_id>/<site>", methods=["GET"])
def get_history(user_id, site):
    rows = call_procedure("sp_get_history", (user_id, site))

    history_list = PasswordHistoryList()
    history_list.load_from_db(rows)

    return jsonify(history_list.traverse()), 200


@app.route("/api/password/<int:user_id>/<site>", methods=["DELETE"])
def delete_password(user_id, site):
    execute_query(
        "DELETE FROM passwords WHERE user_id=%s AND site=%s",
        (user_id, site)
    )
    return jsonify({"message": "Password deleted!"}), 200




if __name__ == "__main__":
    app.run(debug=True, port=5000)