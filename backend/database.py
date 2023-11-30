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
    
    # don't delete. used in app.py
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
    
    def search_by_filter(self, genre, category, os_platforms, languages, required_age, metacritic_lowerbnd, steamspyowners_lowerbnd, price_lowerbnd, price_upperbnd):
        q  = "SELECT * FROM Gameinfo WHERE"
        match genre:
            case "nongame":
                q += " genreisnongame = 1 AND"
            case "indie":
                q += " genreisindie = 1 AND"
            case "action":
                q += " genreisaction = 1 AND"
            case "adventure":
                q += " genreisadventure = 1 AND"
            case "casual":
                q += " genreiscasual = 1 AND"
            case "strategy":
                q += " genreisstrategy = 1 AND"
            case "rpg":
                q += " genreisrpg = 1 AND"
            case "simulation":
                q += " genreissimulation = 1 AND"
            case "sports":
                q += " genreissports = 1 AND"
            case "racing":
                q += " genreisracing = 1 AND"
            case "earlyaccess":
                q += " genreisearlyaccess = 1 AND"
            case "freetoplay":
                q += " genreisfreetoplay = 1 AND"
        match category:
            case "singleplayer":
                q += " categorysingleplayer = 1 AND"
            case "multiplayer":
                q += " categorymultiplayer = 1 AND"
            case "coop":
                q += " categorycoop = 1 AND"
            case "mmo":
                q += " categorymmo = 1 AND"
            case "inapppurchase":
                q += " categoryinapppurchase = 1 AND"
            case "includesrcsdk":
                q += " categoryincludesrcsdk = 1 AND"
            case "includeleveleditor":
                q += " categoryincludeleveleditor = 1 AND"
            case "vrsupport":
                q += " categoryvrsupport = 1 AND"
        match os_platforms:
            case "windows":
                q += " platformwindows = 1 AND"
            case "linux":
                q += " platformlinux = 1 AND"
            case "mac":
                q += " platformmac = 1 AND"
        if languages != "All":
            q += " supportedlanguages LIKE '%{}%' AND".format(languages)
        q += " requiredage >= {} AND".format(required_age)
        q += " metacritic >= {} AND".format(metacritic_lowerbnd)
        q += " steamspyowners >= {} AND".format(steamspyowners_lowerbnd)
        q += " pricefinal >= {} AND".format(price_lowerbnd)
        q += " pricefinal <= {} ".format(price_upperbnd)
        # print(q)
        return self.query(q)

    def add_review(self, userid, gameid, review):
        q = "INSERT INTO Gamereview VALUES({},{},'{}')".format(userid, gameid, review)
        return self.execute(q)
    
    def edit_review(self, userid, gameid, review):
        q = "UPDATE Gamereview SET review = '{}' WHERE userid = {} AND gameid = {}".format(review, userid, gameid)
        return self.execute(q)
    
    def delete_review(self, userid, gameid, review):
        q = "DELETE FROM Gamereview WHERE userid = {} AND gameid = {} AND review = '{}'".format(userid, gameid, review)
        return self.execute(q)

    def add_favorite(self, userid, gameid):
        q = "INSERT INTO Userfavorite VALUES({},{})".format(userid, gameid)
        return self.execute(q)

    def delete_favorite(self, userid, gameid):
        q = "DELETE FROM Userfavorite WHERE userid = {} AND gameid = {}".format(userid, gameid)
        return self.execute(q)

    def get_gameinfo(self, queryid):
        q = "SELECT * FROM Gameinfo WHERE queryid = {}".format(queryid)
        return self.query(q)

    def get_gamereview(self, queryid):
        q = "SELECT username, gameid, review FROM Userinfo u JOin Gamereview g ON u.userid = g.userid WHERE gameid = {}".format(queryid)
        return self.query(q)

    def get_userfavorite(self, userid):
        q = "SELECT * FROM Gameinfo g JOIN Userfavorite u ON g.queryid = u.gameid WHERE u.userid = {}".format(userid)
        return self.query(q)

    def get_userinfo(self, userid):
        q = "SELECT * FROM Userinfo WHERE userid = {}".format(userid)
        return self.query(q)

    def create_procedure_triggers(self):
        create_procedure_gamecount_query_Developer = """
        DELIMITER //

        CREATE PROCEDURE UpdateDeveloperGameCount(IN gameId INT)
        BEGIN
            DECLARE devId INT;
            DECLARE devCount INT;

            SELECT developerid INTO devId FROM Develop WHERE gameid = gameId;

            SELECT COUNT(*) INTO devCount FROM Develop WHERE developerid = devId;

            UPDATE Developer SET gamecount = devCount WHERE developerid = devId;
        END //

        DELIMITER ;
        """
        create_procedure_gamecount_query_Publisher = """
        DELIMITER //

        CREATE PROCEDURE UpdateDeveloperGameCount(IN gameId INT)
        BEGIN
            DECLARE pubId INT;
            DECLARE pubCount INT;

            SELECT publisherid INTO pubId FROM Publish WHERE gameid = gameId;

            SELECT COUNT(*) INTO pubCount FROM Publish WHERE publisherid = pubId;

            UPDATE Publisher SET gamecount = pubCount WHERE publisherid = pubId;
        END //

        DELIMITER ;
        """

        create_procedure_avgmetacritic_query_Developer = """
        DELIMITER //

        CREATE PROCEDURE UpdateDeveloperAvgMetacritic(IN gameId INT)
        BEGIN
            DECLARE devId INT;
            DECLARE devAvgMetacritic FLOAT;
            DECLARE gameMetacritic FLOAT;
            DECLARE done INT DEFAULT 0;

            SELECT developerid INTO devId FROM Develop WHERE gameid = gameId;
            
            SELECT AVG(Gameinfo.metacritic) INTO devAvgMetacritic FROM Develop
            JOIN Gameinfo ON Develop.gameid = Gameinfo.queryid
            WHERE Develop.developerid = devId;

            SELECT metacritic INTO gameMetacritic FROM Gameinfo WHERE queryid = gameId;

            IF gameMetacritic <> 0 THEN
                DECLARE updateCursor CURSOR FOR
                    SELECT queryid FROM Gameinfo WHERE metacritic <> 0;

                DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = 1;
                OPEN updateCursor;

                REPEAT
                    FETCH updateCursor INTO gameId;
                    UPDATE Developer SET avgmetacritic = devAvgMetacritic WHERE developerid = devId;
                UNTIL done END REPEAT;

                CLOSE updateCursor;
            END IF;
        END //

        DELIMITER ;
        """

        create_procedure_avgmetacritic_query_Publisher = """
        DELIMITER //

        CREATE PROCEDURE UpdatePublisherAvgMetacritic(IN gameId INT)
        BEGIN
            DECLARE pubId INT;
            DECLARE pubAvgMetacritic FLOAT;
            DECLARE gameMetacritic FLOAT;
            DECLARE done INT DEFAULT 0;

            SELECT publisherid INTO pubId FROM Publish WHERE gameid = gameId;

            SELECT AVG(Gameinfo.metacritic) INTO pubAvgMetacritic FROM Publish
            JOIN Gameinfo ON Publish.gameid = Gameinfo.queryid
            WHERE Publish.publisherid = pubId;

            SELECT metacritic INTO gameMetacritic FROM Gameinfo WHERE queryid = gameId;

            IF gameMetacritic <> 0 THEN
                DECLARE updateCursor CURSOR FOR
                    SELECT queryid FROM Gameinfo WHERE metacritic <> 0;

                DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = 1;
                OPEN updateCursor;

                REPEAT
                    FETCH updateCursor INTO gameId;
                    UPDATE Publisher SET avgmetacritic = pubAvgMetacritic WHERE publisherid = pubId;
                UNTIL done END REPEAT;

                CLOSE updateCursor;
            END IF;
        END //

        DELIMITER ;
        """

        create_trigger_query = """
        DELIMITER //

        CREATE TRIGGER AfterDevelopInsertUpdateDelete
        AFTER INSERT OR UPDATE OR DELETE ON Develop
        FOR EACH ROW
        BEGIN

            SET gameId = NEW.gameid;

            CALL UpdateDeveloperGameCount(gameId);
            CALL UpdatePublisherGameCount(gameId);
            
            IF NEW.Metacritic <> 0 THEN
                CALL UpdateDeveloperAvgMetacritic(gameId);
                CALL UpdatePublisherAvgMetacritic(gameId);
            END IF;

        END //

        DELIMITER ;
        """
        return self.execute(create_procedure_gamecount_query_Developer) and self.execute(create_procedure_gamecount_query_Publisher) and self.execute(create_procedure_avgmetacritic_query_Developer) and self.execute(create_procedure_avgmetacritic_query_Publisher) and self.execute(create_trigger_query)




if __name__=="__main__":
    db = MyDatabase("yanxinl4", "123456")
    # result = db.search_by_keyword("red")
    # result = db.search_by_filter("action", "singleplayer", "windows", "Chinese", 10, 5, 0, 0, 20)
    # db.add_review(1, 39800, "It is a good game! My son plays it everyday.")
    # result = db.get_gamereview(39800)
    result = db.create_procedure()
    print(result)