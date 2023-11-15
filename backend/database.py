import mysql.connector
from mysql.connector import Error


class MyDatabase:
    host_name = "34.70.44.148"
    database_name = "project"

    def __init__(self, username, password):
        self.username = username
        self.password = password
        self.connection = None
        self.create_connection()

    def create_connection(self):
        try:
            connection = mysql.connector.connect(
                host=MyDatabase.host_name,
                user=self.username,
                passwd=self.password,
                database=MyDatabase.database_name
            )
            print("Connection to MySQL DB successful")
        except Error as e:
            return False

        self.connection = connection

    def execute(self, query):
        cursor = self.connection.cursor()
        try:
            cursor.execute(query)
            self.connection.commit()
            return True
        except Error as e:
            print(f"Database execute error: '{e}'")
            return False

    def query(self, query):
        cursor = self.connection.cursor()
        try:
            cursor.execute(query)
            result = cursor.fetchall()
            return result
        except Error as e:
            print(f"Database query error: '{e}'")
            return False
