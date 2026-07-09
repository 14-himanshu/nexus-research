import sqlite3
import os
import json
from datetime import datetime

DB_PATH = os.path.join(os.path.dirname(__file__), "research.db")

def init_db():
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    
    # Users table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT UNIQUE NOT NULL,
            password_hash TEXT NOT NULL,
            gemini_api_key TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    
    # History table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS history (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER,
            query TEXT NOT NULL,
            report TEXT NOT NULL,
            depth TEXT NOT NULL,
            rating INTEGER DEFAULT 0,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users (id)
        )
    ''')
    
    # Add columns to existing tables if needed
    try:
        cursor.execute('ALTER TABLE history ADD COLUMN rating INTEGER DEFAULT 0')
    except sqlite3.OperationalError:
        pass
        
    try:
        cursor.execute('ALTER TABLE history ADD COLUMN user_id INTEGER')
    except sqlite3.OperationalError:
        pass
        
    conn.commit()
    conn.close()

# --- User Management ---

def create_user(username: str, password_hash: str):
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    try:
        cursor.execute('''
            INSERT INTO users (username, password_hash)
            VALUES (?, ?)
        ''', (username, password_hash))
        conn.commit()
        user_id = cursor.lastrowid
        return user_id
    except sqlite3.IntegrityError:
        return None
    finally:
        conn.close()

def get_user_by_username(username: str):
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute('SELECT id, username, password_hash, gemini_api_key FROM users WHERE username = ?', (username,))
    row = cursor.fetchone()
    conn.close()
    if row:
        return {"id": row[0], "username": row[1], "password_hash": row[2], "gemini_api_key": row[3]}
    return None

def get_user_by_id(user_id: int):
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute('SELECT id, username, gemini_api_key FROM users WHERE id = ?', (user_id,))
    row = cursor.fetchone()
    conn.close()
    if row:
        return {"id": row[0], "username": row[1], "gemini_api_key": row[2]}
    return None

def update_user_settings(user_id: int, gemini_api_key: str):
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute('UPDATE users SET gemini_api_key = ? WHERE id = ?', (gemini_api_key, user_id))
    conn.commit()
    conn.close()

# --- History Management ---

def save_report(user_id: int, query: str, report: str, depth: str):
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute('''
        INSERT INTO history (user_id, query, report, depth, created_at)
        VALUES (?, ?, ?, ?, ?)
    ''', (user_id, query, report, depth, datetime.now().isoformat()))
    conn.commit()
    report_id = cursor.lastrowid
    conn.close()
    return report_id

def get_history(user_id: int, limit: int = 20):
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute('''
        SELECT id, query, depth, rating, created_at FROM history
        WHERE user_id = ? OR user_id IS NULL
        ORDER BY created_at DESC LIMIT ?
    ''', (user_id, limit))
    rows = cursor.fetchall()
    conn.close()
    
    return [
        {"id": r[0], "query": r[1], "depth": r[2], "rating": r[3], "created_at": r[4]}
        for r in rows
    ]

def get_report(user_id: int, report_id: int):
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute('''
        SELECT id, query, report, depth, rating, created_at FROM history
        WHERE id = ? AND (user_id = ? OR user_id IS NULL)
    ''', (report_id, user_id))
    row = cursor.fetchone()
    conn.close()
    
    if row:
        return {
            "id": row[0],
            "query": row[1],
            "report": row[2],
            "depth": row[3],
            "rating": row[4],
            "created_at": row[5]
        }
    return None

def delete_report(user_id: int, report_id: int):
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute('''
        DELETE FROM history
        WHERE id = ? AND (user_id = ? OR user_id IS NULL)
    ''', (report_id, user_id))
    conn.commit()
    conn.close()

def update_rating(user_id: int, report_id: int, rating: int):
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute('''
        UPDATE history
        SET rating = ?
        WHERE id = ? AND (user_id = ? OR user_id IS NULL)
    ''', (rating, report_id, user_id))
    conn.commit()
    conn.close()

# Initialize on import
init_db()
