# 🔐 SecurePass — Rule-Based Password Manager

A full-stack password manager built with React, Flask, and MySQL.
Generate strong passwords, manage them securely, and track history.

---

## 🚀 Features

- 🔑 **Master Login** — SHA-256 hashed authentication
- ⚙️ **Rule Engine** — Custom rules (length, symbols, uppercase, digits)
- 🔐 **Password Generator** — Generates strong passwords based on rules
- 📊 **Strength Meter** — Graph-based scoring (Weak / Medium / Strong)
- 🕒 **History Viewer** — Linked List traversal of past passwords
- ↩️ **Undo Feature** — Stack-based undo of last generated password
- 💾 **Save & Retrieve** — MySQL stores passwords per user/site
- 🗑️ **Delete** — Remove saved passwords anytime

---

## 🛠️ Tech Stack

| Layer    | Technology              |
|----------|-------------------------|
| Frontend | React.js, Axios         |
| Backend  | Python, Flask, Flask-CORS |
| Database | MySQL                   |
| Hashing  | SHA-256 (hashlib)       |

---

## 🧩 Data Structures Used

| Structure    | Usage                                      |
|--------------|--------------------------------------------|
| Linked List  | Password history chain per site            |
| Stack        | Undo last generated password               |
| Graph        | Password strength analyzer (char diversity)|

---

## 🗄️ Database Schema

| Table            | Purpose                              |
|------------------|--------------------------------------|
| users            | Store user accounts + hashed password|
| passwords        | Active password per site per user    |
| rules            | Custom rule sets per user            |
| password_history | Auto-logged history via triggers     |

---

## 📁 Project Structure
```
SecurePass/
├── backend/
│   ├── app.py            # Flask REST API
│   ├── generator.py      # Rule engine + password generator
│   ├── strength.py       # Graph-based strength analyzer
│   ├── history.py        # Linked List implementation
│   ├── undo_stack.py     # Stack implementation
│   └── db/
│       ├── schema.sql    # MySQL schema + triggers
│       └── db_connect.py # MySQL connector
└── frontend/
    └── src/
        ├── pages/
        │   ├── Login.jsx
        │   ├── Register.jsx
        │   ├── Dashboard.jsx
        │   ├── Generator.jsx
        │   └── History.jsx
        └── api/
            └── axiosConfig.js
```

---

## ⚙️ Setup Instructions

### Backend
```bash
cd backend
pip install flask flask-cors mysql-connector-python
python app.py
```

### Frontend
```bash
cd frontend
npm install
npm start
```

### Database
```bash
mysql -u root -p
source backend/db/schema.sql
```

---

## 👩‍💻 Author

Made  by Rashmi
