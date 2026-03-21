# db/db_connect.py — MySQL connection helper for SecurePass

import mysql.connector
from mysql.connector import Error

DB_CONFIG = {
    "host":     "localhost",
    "port":     3306,
    "database": "securepass",
    "user":     "root",       # apna MySQL username
    "password": "Admin@1234"

}

def get_connection():
    try:
        conn = mysql.connector.connect(**DB_CONFIG)
        if conn.is_connected():
            return conn
    except Error as e:
        raise ConnectionError(f"[DB] Could not connect to MySQL: {e}")

def execute_query(query: str, params: tuple = (), fetch: bool = False):
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)
    try:
        cursor.execute(query, params)
        if fetch:
            return cursor.fetchall()
        conn.commit()
        return cursor.lastrowid
    except Error as e:
        conn.rollback()
        raise RuntimeError(f"[DB] Query failed: {e}")
    finally:
        cursor.close()
        conn.close()

def call_procedure(proc_name: str, args: tuple = ()):
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)
    try:
        cursor.callproc(proc_name, args)
        rows = []
        for result in cursor.stored_results():
            rows.extend(result.fetchall())
        return rows
    except Error as e:
        raise RuntimeError(f"[DB] Procedure {proc_name} failed: {e}")
    finally:
        cursor.close()
        conn.close()