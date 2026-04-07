from flask import Flask, render_template, request, jsonify
from flask_cors import CORS
import sqlite3
import os
from datetime import datetime

app = Flask(__name__)
CORS(app)

def init_db():
    if not os.path.exists('data'):
        os.makedirs('data')
    conn = sqlite3.connect('data/responses.db')
    c = conn.cursor()
    c.execute('''
        CREATE TABLE IF NOT EXISTS feedback (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            usage_frequency TEXT,
            ai_tools TEXT,
            impact_area TEXT,
            future_fears TEXT,
            age_group TEXT,
            timestamp TEXT
        )
    ''')
    conn.commit()
    conn.close()

init_db()

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/submit-feedback', methods=['POST'])
def submit_feedback():
    try:
        data = request.get_json()
        usage_frequency = data.get('usage_frequency', '')
        ai_tools = data.get('ai_tools', '')
        impact_area = data.get('impact_area', '')
        future_fears = data.get('future_fears', '')
        age_group = data.get('age_group', '')
        timestamp = datetime.now().isoformat()

        conn = sqlite3.connect('data/responses.db')
        c = conn.cursor()
        c.execute('''
            INSERT INTO feedback 
            (usage_frequency, ai_tools, impact_area, future_fears, age_group, timestamp) 
            VALUES (?, ?, ?, ?, ?, ?)
        ''', (usage_frequency, ai_tools, impact_area, future_fears, age_group, timestamp))
        conn.commit()
        conn.close()

        return jsonify({'status': 'success', 'message': 'Спасибо! Ваше мнение очень важно для нас!'}), 200
    except Exception as e:
        return jsonify({'status': 'error', 'message': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)