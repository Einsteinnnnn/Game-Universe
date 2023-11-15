import mysql.connector
from mysql.connector import Error

NETID = 'liyi3'

class MyDatabase:

    host_name = "34.70.44.148"
    database_name = "project"

    def __init__(self, username, password):
        self.username = username
        self.password = password
        self.connetion = None
        self.create_connection()

    def create_connection(self):
        connection = None
        try:
            connection = mysql.connector.connect(
                host=MyDatabase.host_name,
                user=self.username,
                passwd=self.password,
                database=MyDatabase.database_name
            )
            print("Connection to MySQL DB successful")
        except Error as e:
            print(f"The error '{e}' occurred")

        self.connection = connection

    def execute(self, query):
        cursor = self.connection.cursor()
        try:
            cursor.execute(query)
            self.connection.commit()
            print("Query executed successfully")
        except Error as e:
            print(f"The error '{e}' occurred")

    def query(self, query):
        cursor = self.connection.cursor()
        result = None
        try:
            cursor.execute(query)
            result = cursor.fetchall()
            return result
        except Error as e:
            print(f"The error '{e}' occurred")
