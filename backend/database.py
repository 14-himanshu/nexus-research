import psycopg2
from psycopg2.extras import DictCursor
import os
import json
from datetime import datetime
from cryptography.fernet import Fernet
from contextlib import closing

ENCRYPTION_KEY = os.getenv("ENCRYPTION_KEY")
if not ENCRYPTION_KEY:
    raise RuntimeError("ENCRYPTION_KEY environment variable is not set! Set it in .env")

DATABASE_URL = os.getenv("DATABASE_URL")
if not DATABASE_URL:
    raise RuntimeError("DATABASE_URL environment variable is not set! Set it in .env")

cipher_suite = Fernet(ENCRYPTION_KEY)

def encrypt_key(key: str) -> str:
    if not key:
        return key
    return cipher_suite.encrypt(key.encode()).decode()

def decrypt_key(encrypted_key: str) -> str:
    if not encrypted_key:
        return encrypted_key
    try:
        return cipher_suite.decrypt(encrypted_key.encode()).decode()
    except Exception:
        # Fallback for plain-text existing keys
        return encrypted_key

def get_connection():
    return psycopg2.connect(DATABASE_URL)

def init_db():
    with closing(get_connection()) as conn:
        with conn.cursor() as cursor:
            # Users table
            cursor.execute('''
                CREATE TABLE IF NOT EXISTS users (
                    id SERIAL PRIMARY KEY,
                    username TEXT UNIQUE NOT NULL,
                    password_hash TEXT NOT NULL,
                    gemini_api_key TEXT,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                )
            ''')
            
            # Collections table (must be created before history for foreign key)
            cursor.execute('''
                CREATE TABLE IF NOT EXISTS collections (
                    id SERIAL PRIMARY KEY,
                    user_id INTEGER NOT NULL REFERENCES users (id),
                    name TEXT NOT NULL,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                )
            ''')
            
            # History table
            cursor.execute('''
                CREATE TABLE IF NOT EXISTS history (
                    id SERIAL PRIMARY KEY,
                    user_id INTEGER REFERENCES users (id),
                    query TEXT NOT NULL,
                    report TEXT NOT NULL,
                    depth TEXT NOT NULL,
                    rating INTEGER DEFAULT 0,
                    collection_id INTEGER REFERENCES collections(id),
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                )
            ''')
            
        conn.commit()

# --- User Management ---

def create_user(username: str, password_hash: str):
    with closing(get_connection()) as conn:
        with conn.cursor() as cursor:
            try:
                cursor.execute('''
                    INSERT INTO users (username, password_hash)
                    VALUES (%s, %s) RETURNING id
                ''', (username, password_hash))
                user_id = cursor.fetchone()[0]
                conn.commit()
                return user_id
            except psycopg2.IntegrityError:
                return None

def get_user_by_username(username: str):
    with closing(get_connection()) as conn:
        with conn.cursor() as cursor:
            cursor.execute('SELECT id, username, password_hash, gemini_api_key FROM users WHERE username = %s', (username,))
            row = cursor.fetchone()
            if row:
                api_key = decrypt_key(row[3]) if row[3] else None
                return {"id": row[0], "username": row[1], "password_hash": row[2], "gemini_api_key": api_key}
            return None

def get_user_by_id(user_id: int):
    with closing(get_connection()) as conn:
        with conn.cursor() as cursor:
            cursor.execute('SELECT id, username, gemini_api_key FROM users WHERE id = %s', (user_id,))
            row = cursor.fetchone()
            if row:
                api_key = decrypt_key(row[2]) if row[2] else None
                return {"id": row[0], "username": row[1], "gemini_api_key": api_key}
            return None

def update_user_settings(user_id: int, gemini_api_key: str):
    with closing(get_connection()) as conn:
        with conn.cursor() as cursor:
            encrypted_key = encrypt_key(gemini_api_key) if gemini_api_key else None
            cursor.execute('UPDATE users SET gemini_api_key = %s WHERE id = %s', (encrypted_key, user_id))
            conn.commit()

# --- History Management ---

def save_report(user_id: int, query: str, report: str, depth: str, collection_id: int = None):
    with closing(get_connection()) as conn:
        with conn.cursor() as cursor:
            cursor.execute('''
                INSERT INTO history (user_id, query, report, depth, created_at, collection_id)
                VALUES (%s, %s, %s, %s, %s, %s) RETURNING id
            ''', (user_id, query, report, depth, datetime.now().isoformat(), collection_id))
            report_id = cursor.fetchone()[0]
            conn.commit()
            return report_id

def get_history(user_id: int, collection_id: int = None, limit: int = 50):
    with closing(get_connection()) as conn:
        with conn.cursor() as cursor:
            if collection_id is not None:
                cursor.execute('''
                    SELECT id, query, depth, rating, created_at, collection_id FROM history
                    WHERE user_id = %s AND collection_id = %s
                    ORDER BY created_at DESC LIMIT %s
                ''', (user_id, collection_id, limit))
            else:
                cursor.execute('''
                    SELECT id, query, depth, rating, created_at, collection_id FROM history
                    WHERE user_id = %s
                    ORDER BY created_at DESC LIMIT %s
                ''', (user_id, limit))
            rows = cursor.fetchall()
            
            return [
                {"id": r[0], "query": r[1], "depth": r[2], "rating": r[3], "created_at": r[4].isoformat() if isinstance(r[4], datetime) else r[4], "collection_id": r[5]}
                for r in rows
            ]

# --- Collections Management ---

def create_collection(user_id: int, name: str):
    with closing(get_connection()) as conn:
        with conn.cursor() as cursor:
            cursor.execute('''
                INSERT INTO collections (user_id, name)
                VALUES (%s, %s) RETURNING id
            ''', (user_id, name))
            collection_id = cursor.fetchone()[0]
            conn.commit()
            return collection_id

def get_collections(user_id: int):
    with closing(get_connection()) as conn:
        with conn.cursor() as cursor:
            cursor.execute('''
                SELECT id, name, created_at FROM collections
                WHERE user_id = %s
                ORDER BY created_at DESC
            ''', (user_id,))
            rows = cursor.fetchall()
            return [{"id": r[0], "name": r[1], "created_at": r[2].isoformat() if isinstance(r[2], datetime) else r[2]} for r in rows]

def delete_collection(user_id: int, collection_id: int):
    with closing(get_connection()) as conn:
        with conn.cursor() as cursor:
            cursor.execute('UPDATE history SET collection_id = NULL WHERE collection_id = %s AND user_id = %s', (collection_id, user_id))
            cursor.execute('DELETE FROM collections WHERE id = %s AND user_id = %s', (collection_id, user_id))
            conn.commit()

def update_report_collection(user_id: int, report_id: int, collection_id: int):
    with closing(get_connection()) as conn:
        with conn.cursor() as cursor:
            cursor.execute('''
                UPDATE history SET collection_id = %s
                WHERE id = %s AND user_id = %s
            ''', (collection_id, report_id, user_id))
            conn.commit()


def get_report(user_id: int, report_id: int):
    with closing(get_connection()) as conn:
        with conn.cursor() as cursor:
            cursor.execute('''
                SELECT id, query, report, depth, rating, created_at, collection_id FROM history
                WHERE id = %s AND (user_id = %s OR user_id IS NULL)
            ''', (report_id, user_id))
            row = cursor.fetchone()
            
            if row:
                return {
                    "id": row[0],
                    "query": row[1],
                    "report": row[2],
                    "depth": row[3],
                    "rating": row[4],
                    "created_at": row[5].isoformat() if isinstance(row[5], datetime) else row[5],
                    "collection_id": row[6]
                }
            return None

def delete_report(user_id: int, report_id: int):
    with closing(get_connection()) as conn:
        with conn.cursor() as cursor:
            cursor.execute('''
                DELETE FROM history
                WHERE id = %s AND (user_id = %s OR user_id IS NULL)
            ''', (report_id, user_id))
            conn.commit()

def update_rating(user_id: int, report_id: int, rating: int):
    with closing(get_connection()) as conn:
        with conn.cursor() as cursor:
            cursor.execute('''
                UPDATE history
                SET rating = %s
                WHERE id = %s AND (user_id = %s OR user_id IS NULL)
            ''', (rating, report_id, user_id))
            conn.commit()

# Initialize on import
try:
    init_db()
except Exception as e:
    print(f"Warning: Could not initialize database on import: {e}")
