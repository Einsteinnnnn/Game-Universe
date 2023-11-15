# flask app

import sys
from flask import Flask
from database import MyDatabase


app = Flask(__name__)
my_database = MyDatabase(username=sys.argv[1], password='123456')

@app.route('/')
def index():
    return 'All users: ' + str(my_database.query('SELECT * FROM Userinfo'))

if __name__ == '__main__':
    app.run(debug=True)
