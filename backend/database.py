from mysql.connector import Error, pooling


class MyDatabase:
    host_name = "34.70.44.148"
    database_name = "project"
    pool_size = 5
    _pool = None

    def __init__(self, username, password):
        self.username = username
        self.password = password
        self.connection = None
        if MyDatabase._pool is None:
            self._create_pool()

    def _create_pool(self):
        MyDatabase._pool = pooling.MySQLConnectionPool(
            pool_name="pool",
            pool_size=MyDatabase.pool_size,
            host=MyDatabase.host_name,
            user=self.username,
            password=self.password,
            database=MyDatabase.database_name
        )

    @staticmethod
    def is_connected():
        if MyDatabase._pool:
            return True
        else:
            return False

    @staticmethod
    def execute(s):
        connection = MyDatabase._pool.get_connection()
        cursor = connection.cursor()
        try:
            cursor.execute(s)
            connection.commit()
            result = True
        except Error as e:
            print(f"Database execute error: '{e}'")
            result = False
        finally:
            cursor.close()
            connection.close()
        return result

    @staticmethod
    def query(q):
        connection = MyDatabase._pool.get_connection()
        cursor = connection.cursor()
        try:
            cursor.execute(q)
            result = cursor.fetchall()
        except Error as e:
            print(f"Database query error: '{e}'")
            result = False
        finally:
            cursor.close()
            connection.close()
        return result
        
    def user_login(self, un, pw):
        q = "SELECT * FROM Userinfo WHERE username = '{}' AND password = '{}'".format(un, pw)
        return self.query(q)
    
    def username_check(self, un):
        q = "SELECT * FROM Userinfo WHERE username = '{}'".format(un)
        return self.query(q)

    def valid_userid(self):
        q = "SELECT MAX(userid) FROM Userinfo"
        return self.query(q)[0][0] + 1

    def user_register(self, un, pw, email, phonenum):
        userid = self.valid_userid()
        q = "INSERT INTO Userinfo VALUES({},'{}','{}','{}','{}')".format(userid, un, pw, email, phonenum)
        return self.execute(q)
    
    def search_by_keyword(self, keyword):
        q  = "SELECT * FROM Gameinfo WHERE queryname LIKE '%{}%'".format(keyword)
        return self.query(q)

    def add_review(self, userid, gameid, review):
        q = "INSERT INTO Gamereview VALUES({},{},{})".format(userid, gameid, review)
        return self.query(q)
    
    def add_favorite(self, userid, gameid):
        q = "INSERT INTO Userfavorite VALUES({},{})".format(userid, gameid)
        return self.query(q)
