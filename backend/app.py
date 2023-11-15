import sys
from flask import Flask
from database import MyDatabase

app = Flask(__name__)

if len(sys.argv) < 2:
    sys.exit('Include netid as database username. Usage: $ python app.py [netid]')
my_database = MyDatabase(username=sys.argv[1], password='123456')
if my_database.connection is None:
    sys.exit('Failed to connect to database. Check your username and password.')


@app.route('/')
def index():
    return 'All users: ' + str(my_database.query('SELECT * FROM Userinfo'))


if __name__ == '__main__':
    app.run(debug=True)
