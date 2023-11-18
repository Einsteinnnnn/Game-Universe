import sys
from flask import Flask
from database import MyDatabase

app = Flask(__name__, static_folder='static', static_url_path='/')

if len(sys.argv) < 2:
    sys.exit('Include netid as database username. Usage: $ python app.py [netid]')
my_database = MyDatabase(username=sys.argv[1], password='123456')
if my_database.connection is None:
    sys.exit('Failed to connect to database. Check your username and password.')


@app.errorhandler(404)
def index(e):
    return app.send_static_file('index.html')


if __name__ == '__main__':
    app.run(debug=True)
