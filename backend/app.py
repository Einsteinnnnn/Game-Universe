# flask app

import mysql.connector
from mysql.connector import Error
from flask import Flask


app = Flask(__name__)

@app.route('/')
def index():
    return 'Hello World!'

if __name__ == '__main__':
    app.run(debug=True)


def create_connection(host_name, user_name, user_password, db_name):
    connection = None
    try:
        connection = mysql.connector.connect(
            host=host_name,
            user=user_name,
            passwd=user_password,
            database=db_name
        )
        print("Connection to MySQL DB successful")
    except Error as e:
        print(f"The error '{e}' occurred")

    return connection

def execute_query(connection, query):
    cursor = connection.cursor()
    try:
        cursor.execute(query)
        connection.commit()
        print("Query executed successfully")
    except Error as e:
        print(f"The error '{e}' occurred")

# 连接数据库
connection = create_connection("your_host", "your_username", "your_password", "your_dbname")

# 创建表
create_table_query = """
CREATE TABLE IF NOT EXISTS games (
  id INT AUTO_INCREMENT,
  title VARCHAR(100) NOT NULL,
  genre VARCHAR(40) NOT NULL,
  PRIMARY KEY (id)
) ENGINE = InnoDB
"""
execute_query(connection, create_table_query)

# 插入数据
insert_games_query = """
INSERT INTO games (title, genre) VALUES ('The Witcher 3', 'Action RPG'), ('Cyberpunk 2077', 'Action RPG')
"""
execute_query(connection, insert_games_query)

# 查询数据
def execute_read_query(connection, query):
    cursor = connection.cursor()
    result = None
    try:
        cursor.execute(query)
        result = cursor.fetchall()
        return result
    except Error as e:
        print(f"The error '{e}' occurred")

select_games = "SELECT * FROM games"
games = execute_read_query(connection, select_games)

for game in games:
    print(game)
