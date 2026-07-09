import sqlite3
import os
import json
from datetime import datetime

DB_PATH = os.path.join(os.path.dirname(__file__), "research.db")

def init_db():
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS history (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            query TEXT NOT NULL,
            report TEXT NOT NULL,
            depth TEXT NOT NULL,
            rating INTEGER DEFAULT 0,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    try:
        cursor.execute('ALTER TABLE history ADD COLUMN rating INTEGER DEFAULT 0')
    except sqlite3.OperationalError:
        pass # Column might already exist
    conn.commit()
    conn.close()

def save_report(query: str, report: str, depth: str):
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute('''
        INSERT INTO history (query, report, depth, created_at)
        VALUES (?, ?, ?, ?)
    ''', (query, report, depth, datetime.now().isoformat()))
    conn.commit()
    report_id = cursor.lastrowid
    conn.close()
    return report_id

def get_history(limit: int = 20):
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute('''
        SELECT id, query, depth, rating, created_at FROM history
        ORDER BY created_at DESC LIMIT ?
    ''', (limit,))
    rows = cursor.fetchall()
    conn.close()
    
    return [
        {"id": r[0], "query": r[1], "depth": r[2], "rating": r[3], "created_at": r[4]}
        for r in rows
    ]

def get_report(report_id: int):
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute('''
        SELECT id, query, report, depth, rating, created_at FROM history
        WHERE id = ?
    ''', (report_id,))
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

def delete_report(report_id: int):
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute('''
        DELETE FROM history
        WHERE id = ?
    ''', (report_id,))
    conn.commit()
    conn.close()

def update_rating(report_id: int, rating: int):
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute('''
        UPDATE history
        SET rating = ?
        WHERE id = ?
    ''', (rating, report_id))
    conn.commit()
    conn.close()

# Initialize on import
init_db()
