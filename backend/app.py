import sys
from flask import Flask, request, session
from datetime import timedelta
from database import MyDatabase

app = Flask(__name__, static_folder='static', static_url_path='/')
app.config['SECRET_KEY'] = 'GameUniverse'
app.config['PERMANENT_SESSION_LIFETIME'] = timedelta(days=7)

if len(sys.argv) < 2:
    sys.exit('Include netid as database username. Usage: $ python app.py [netid]')
my_database = MyDatabase(username=sys.argv[1], password='123456')
if my_database.connection is None:
    sys.exit('Failed to connect to database. Check your username and password.')


@app.errorhandler(404)
def index(e):
    return app.send_static_file('index.html')


@app.route('/api/login', methods=['POST'])
def login():
    post_data = request.get_json()
    try:
        username = post_data['username']
        password = post_data['password']
    except KeyError:
        return {'status': 'error', 'message': 'Invalid request.'}
    check = my_database.user_login(username, password)
    if check:
        session['username'] = username
        return {'status': 'ok'}
    else:
        return {'status': 'error', 'message': 'Invalid username or password.'}


@app.route('/api/logout', methods=['POST'])
def logout():
    session.pop('username', None)
    return {'status': 'ok'}


if __name__ == '__main__':
    app.run(debug=True)
