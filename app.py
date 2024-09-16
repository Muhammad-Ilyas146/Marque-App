from flask import Flask, render_template, request, jsonify
import sqlite3

app = Flask(__name__)

# Initialize the database and create the events table if it doesn't exist
def init_db():
    conn = sqlite3.connect('db/events.db')
    c = conn.cursor()
    c.execute('''
        CREATE TABLE IF NOT EXISTS events (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            client_name TEXT,
            event_type TEXT,
            event_date TEXT,
            total_invoice REAL,
            advance REAL,
            first_installment REAL,
            second_installment REAL,
            third_installment REAL,
            remaining_balance REAL
        )
    ''')
    conn.commit()
    conn.close()

# Home page route
@app.route('/')
def index():
    return render_template('index.html')

# Endpoint to book an event (POST request)
@app.route('/book_event', methods=['POST'])
def book_event():
    data = request.json
    client_name = data['clientName']
    event_type = data['eventType']
    event_date = data['eventDate']
    total_invoice = data['totalInvoice']
    advance = data['advance']
    first_installment = data.get('firstInstallment', 0)  # Default to 0 if not provided
    second_installment = data.get('secondInstallment', 0)  # Default to 0 if not provided
    third_installment = data.get('thirdInstallment', 0)  # Default to 0 if not provided

    # Calculate the remaining balance
    remaining_balance = total_invoice - (advance + first_installment + second_installment + third_installment)

    conn = sqlite3.connect('db/events.db')
    c = conn.cursor()

    # Check if the event date is already booked
    c.execute('SELECT * FROM events WHERE event_date = ?', (event_date,))
    if c.fetchone():
        return jsonify({"error": "This date is already booked."}), 400

    # Insert the new event into the database
    c.execute('''
        INSERT INTO events (client_name, event_type, event_date, total_invoice, advance, first_installment, second_installment, third_installment, remaining_balance) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    ''', (client_name, event_type, event_date, total_invoice, advance, first_installment, second_installment, third_installment, remaining_balance))
    
    conn.commit()
    conn.close()
    
    return jsonify({"message": "Event booked successfully!"})

# Endpoint to retrieve all events (GET request)
@app.route('/get_events', methods=['GET'])
def get_events():
    conn = sqlite3.connect('db/events.db')
    c = conn.cursor()
    c.execute('''
        SELECT client_name, event_type, event_date, total_invoice, advance, first_installment, second_installment, third_installment, remaining_balance 
        FROM events
    ''')
    events = c.fetchall()
    conn.close()

    # Return the events as JSON
    return jsonify([{
        'client_name': row[0],
        'event_type': row[1],
        'event_date': row[2],
        'total_invoice': row[3],
        'advance': row[4],
        'first_installment': row[5],
        'second_installment': row[6],
        'third_installment': row[7],
        'remaining_balance': row[8]
    } for row in events])

# Initialize the database when the app starts
if __name__ == '__main__':
    init_db()
    app.run(debug=True)
