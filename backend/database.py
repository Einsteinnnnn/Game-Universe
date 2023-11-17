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
        
    def user_login(self, un, pw):
        q = "SELECT * FROM User_info WHERE username = {} AND password = {}".format(un, pw)
        result = query(q)
        if result:
            print("Login success")
        else:
            print("Login fail")
        return True
    
    def username_check(self, un):
        q  = "SELECT * FROM User_info WHERE username = {}".format(un)
        result = query(q)
        if result:
            return False
        else:
            return True

    def valid_userid(self):
        q = "SELECT COUNT(*) FROM User_info"
        return self.query(q)

    def user_register(self, un, pw, email, phonenum):
        userid = self.valid_userid()
        q = "INSERT INTO User_info VALUES({},{},{},{},{})".format(userid, un, pw, email, phonenum)
        return self.query(q)
    
    def search_by_keyword(self, keyword):
        q  = "SELECT * FROM Game_info WHERE queryname LIKE '%{}%'".format(keyword)
        return self.query(q)

    def add_review(self, userid, gameid, review):
        q = "INSERT INTO Gamereview VALUES({},{},{})".format(userid, gameid, review)
        return self.query(q)
    
    def add_favorite(self, userid, gameid):
        q = "INSERT INTO Userfavorite VALUES({},{})".format(userid, gameid)
        return self.query(q)
