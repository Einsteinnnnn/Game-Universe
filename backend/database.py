from mysql.connector import Error, pooling

class MyDatabase:
    host_name = "34.70.44.148"
    database_name = "project"
    pool_size = 5
    _pool = None
    genre_name_map = {
        "nongame": "genreisnongame",
        "indie": "genreisindie",
        "action": "genreisaction",
        "adventure": "genreisadventure",
        "casual": "genreiscasual",
        "strategy": "genreisstrategy",
        "rpg": "genreisrpg",
        "simulation": "genreissimulation",
        "sports": "genreissports",
        "racing": "genreisracing",
        "earlyaccess": "genreisearlyaccess",
        "freetoplay": "genreisfreetoplay"
    }
    category_name_map = {
        "singleplayer": "categorysingleplayer",
        "multiplayer": "categorymultiplayer",
        "coop": "categorycoop",
        "mmo": "categorymmo",
        "inapppurchase": "categoryinapppurchase",
        "includesrcsdk": "categoryincludesrcsdk",
        "includeleveleditor": "categoryincludeleveleditor",
        "vrsupport": "categoryvrsupport"
    }
    platform_name_map = {
        "windows": "platformwindows",
        "linux": "platformlinux",
        "mac": "platformmac"
    }

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
        if genre in self.genre_name_map:
            q += " {} = 1 AND".format(self.genre_name_map[genre])
        if category in self.category_name_map:
            q += " {} = 1 AND".format(self.category_name_map[category])
        if os_platforms in self.platform_name_map:
            q += " {} = 1 AND".format(self.platform_name_map[os_platforms])
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

    def valid_gameid(self):
        q = "SELECT MAX(queryid) FROM Gameinfo"
        return self.query(q)[0][0] + 1
    
    def valid_dev(self, developername):
        q = "SELECT * FROM Developer WHERE developername = '{}'".format(developername)
        result = self.query(q)
        if result:
            return result
        else:
            q = "INSERT INTO Developer VALUES('{}', 0, 0)".format(developername)
            return self.execute(q)
    
    def valid_pub(self, publishername):
        q = "SELECT * FROM Publisher WHERE publishername = '{}'".format(publishername)
        result = self.query(q)
        if result:
            return result
        else:
            q = "INSERT INTO Publisher VALUES('{}', 0, 0)".format(publishername)
            return self.execute(q)

    def add_newgame(self, gamename, developername, publishername, headerimage, genre, platform, languages):
        self.valid_dev(developername)
        self.valid_pub(publishername)
        g = self.genre_name_map[genre]
        p = self.platform_name_map[platform]
        gameid = self.valid_gameid()
        q = """INSERT INTO Gameinfo(queryid, responseid, queryname, responsename, headerimage, supportedlanguages, {}, {}) 
            VALUES('{}','{}','{}','{}','{}','{}', 1, 1)""".format(g, p, gameid, gameid, gamename, gamename, headerimage, languages)
        self.execute(q)
        q1 = "INSERT INTO Develop VALUES('{}', {})".format(developername, gameid)
        q2 = "INSERT INTO Publish VALUES('{}', {})".format(publishername, gameid)
        return self.execute(q1) and self.execute(q2)


    def get_gameinfo(self, queryid):
        q = "SELECT * FROM Gameinfo WHERE queryid = {}".format(queryid)
        return self.query(q)
    
    def get_gamedev(self, queryid):
        q = "SELECT d.developername, gamecount, avgmetacritic FROM Develop d JOIN Developer dr ON d.developername = dr.developername WHERE gameid = {}".format(queryid)
        return self.query(q)
    
    def get_gamepub(self, queryid):
        q = "SELECT p.publishername, gamecount, avgmetacritic FROM Publish p JOIN Publisher pr ON p.publishername = pr.publishername WHERE gameid = {}".format(queryid)
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

    def call_procedure(self):
        q = "CALL Return_TOP_and_BOT_10"
        self.execute(q)
        q = "SELECT * FROM return_TOP UNION SELECT * FROM return_BOT"
        return self.query(q)

    def create_procedure(self):
        p = "DROP PROCEDURE IF EXISTS Return_TOP_and_BOT_10"
        self.execute(p)
        p_10 = """
        CREATE PROCEDURE Return_TOP_and_BOT_10()
        BEGIN
            DECLARE gameid INT;
            DECLARE numUsers INT;
            DECLARE counter INT;
            DECLARE gname VARCHAR(255);
            DECLARE sdescrip TEXT;
            DECLARE himage VARCHAR(255);
            DECLARE done INT DEFAULT 0;
            DECLARE topcursor CURSOR FOR 
                SELECT Userfavorite.gameid AS gid, COUNT(DISTINCT userid) AS nu, queryname, detaileddescrip, headerimage
                FROM Userfavorite JOIN Gameinfo ON Userfavorite.gameid = Gameinfo.queryid 
                GROUP BY gid
                ORDER BY nu DESC
                LIMIT 10;
            DECLARE botcursor CURSOR FOR 
                SELECT Userfavorite.gameid AS gid, COUNT(DISTINCT userid) AS nu, queryname, detaileddescrip, headerimage 
                FROM Userfavorite JOIN Gameinfo ON Userfavorite.gameid = Gameinfo.queryid 
                GROUP BY gid
                ORDER BY nu ASC
                LIMIT 10;
            DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = 1;

            DROP TABLE IF EXISTS return_TOP, return_BOT;
            SET counter=1;

            CREATE TABLE return_TOP(
                gameid INT,
                gamename VARCHAR(255),
                detaileddescrip TEXT,
                headerimage VARCHAR(255),
                numUsers_indicator VARCHAR(255)
            );
            CREATE TABLE return_BOT(
                gameid INT,
                gamename VARCHAR(255),
                detaileddescrip TEXT,
                headerimage VARCHAR(255),
                numUsers_indicator VARCHAR(255)
            );

            OPEN topcursor;
            REPEAT
                FETCH topcursor INTO gameid, numUsers, gname, sdescrip, himage;
                IF counter<=3 THEN
                    INSERT IGNORE INTO return_TOP
                    VALUES(gameid, gname, sdescrip, himage, "Great Hit");
                ELSEIF counter<=7 THEN
                    INSERT IGNORE INTO return_TOP
                    VALUES(gameid, gname, sdescrip, himage, "Growing Fandom");
                ELSEIF counter<=10 THEN
                    INSERT IGNORE INTO return_TOP
                    VALUES(gameid, gname, sdescrip, himage, "Cult Following"); 
                END IF;
                SET counter = counter + 1;
            UNTIL done END REPEAT;
            CLOSE TOPcursor;

            SET done = 0;
            SET counter =1;
            OPEN botcursor;
            REPEAT
                FETCH botcursor INTO gameid, numUsers, gname, sdescrip, himage;
                IF counter<=3 THEN
                    INSERT IGNORE INTO return_BOT 
                    VALUES (gameid, gname, sdescrip, himage, "Dead Duck");
                ELSEIF counter<=7 THEN
                    INSERT IGNORE INTO return_BOT 
                    VALUES (gameid, gname, sdescrip, himage, "Half Dead");
                ELSEIF counter<=10 THEN
                    INSERT IGNORE INTO return_BOT 
                    VALUES (gameid, gname, sdescrip, himage, "Starving");
                END IF;
                SET counter = counter + 1;
            UNTIL done END REPEAT;
            CLOSE botcursor;
        END;
        """
        return self.execute(p_10)

    def drop_triggers(self):
        q_di = "DROP TRIGGER IF EXISTS Develop_Insert"
        q_du = "DROP TRIGGER IF EXISTS Develop_Update"
        q_dd = "DROP TRIGGER IF EXISTS Develop_Delete"
        q_pi = "DROP TRIGGER IF EXISTS Publish_Insert"
        q_pu = "DROP TRIGGER IF EXISTS Publish_Update"
        q_pd = "DROP TRIGGER IF EXISTS Publish_Delete"
        q_gu = "DROP TRIGGER IF EXISTS Gameinfo_update"
        return self.execute(q_di) and self.execute(q_du) and self.execute(q_dd) and self.execute(q_pi) and self.execute(q_pu) and self.execute(q_pd) and self.execute(q_gu)

    
    def create_trigger(self):
        q_di = """
        CREATE TRIGGER Develop_Insert
        AFTER INSERT ON Develop
            FOR EACH ROW
        BEGIN
            SET @gamecnt = (SELECT gamecount
                            FROM Developer d 
                            WHERE d.developername = new.developername);
            UPDATE Developer SET gamecount = @gamecnt + 1 WHERE developername = new.developername;
            SET @metacritic = (SELECT metacritic
                                FROM Gameinfo
                                WHERE queryid = new.gameid);
            IF @metacritic <> 0 THEN
                SET @new_avg = (SELECT AVG(metacritic)
                                FROM Develop d JOIN Gameinfo g ON d.gameid = g.queryid
                                WHERE d.developername = new.developername AND metacritic <> 0
                                GROUP BY d.developername);
                UPDATE Developer SET avgmetacritic = @new_avg WHERE developername = new.developername;
            END IF;
        END
        """

        q_du = """
        CREATE TRIGGER Develop_Update
        AFTER Update ON Develop
            FOR EACH ROW
        BEGIN
            SET @gamecnt = (SELECT COUNT(*) 
                            FROM Develop d 
                            WHERE d.developername = new.developername
                            GROUP BY developername);
            UPDATE Developer SET gamecount = @gamecnt WHERE developername = new.developername;
            SET @metacritic = (SELECT metacritic
                                FROM Gameinfo
                                WHERE queryid = new.gameid);
            IF @metacritic <> 0 THEN
                SET @new_avg = (SELECT AVG(metacritic)
                                FROM Develop d JOIN Gameinfo g ON d.gameid = g.queryid
                                WHERE d.developername = new.developername AND metacritic <> 0
                                GROUP BY d.developername);
                UPDATE Developer SET avgmetacritic = @new_avg WHERE developername = new.developername;
            END IF;
        END
        """

        q_dd = """
        CREATE TRIGGER Develop_Delete
        AFTER DELETE ON Develop
            FOR EACH ROW
        BEGIN
            SET @gamecnt = (SELECT gamecount
                            FROM Developer d 
                            WHERE d.developername = old.developername);
            UPDATE Developer SET gamecount = @gamecnt - 1 WHERE developername = old.developername;
            SET @metacritic = (SELECT metacritic
                                FROM Gameinfo
                                WHERE queryid = old.gameid);
            IF @metacritic <> 0 THEN
                SET @new_avg = (SELECT AVG(metacritic)
                                FROM Develop d JOIN Gameinfo g ON d.gameid = g.queryid
                                WHERE d.developername = old.developername AND metacritic <> 0
                                GROUP BY d.developername);
                UPDATE Developer SET avgmetacritic = @new_avg WHERE developername = old.developername;
            END IF;
        END
        """

        q_pi = """
        CREATE TRIGGER Publish_Insert
        AFTER INSERT ON Publish
            FOR EACH ROW
        BEGIN
            SET @gamecnt = (SELECT gamecount
                            FROM Publisher p 
                            WHERE p.publishername = new.publishername);
            UPDATE Publisher SET gamecount = @gamecnt + 1 WHERE publishername = new.publishername;
            SET @metacritic = (SELECT metacritic
                                FROM Gameinfo
                                WHERE queryid = new.gameid);
            IF @metacritic <> 0 THEN
                SET @new_avg = (SELECT AVG(metacritic)
                                FROM Publish p JOIN Gameinfo g ON p.gameid = g.queryid
                                WHERE p.publishername = new.publishername AND metacritic <> 0
                                GROUP BY p.publishername);
                UPDATE Publisher SET avgmetacritic = @new_avg WHERE publishername = new.publishername;
            END IF;
        END
        """

        q_pu = """
        CREATE TRIGGER Publish_Update
        AFTER Update ON Publish
            FOR EACH ROW
        BEGIN
            SET @gamecnt = (SELECT COUNT(*) 
                            FROM Publish p 
                            WHERE p.publishername = new.publishername
                            GROUP BY publishername);
            UPDATE Publisher SET gamecount = @gamecnt WHERE publishername = new.publishername;
            SET @metacritic = (SELECT metacritic
                                FROM Gameinfo
                                WHERE queryid = new.gameid);
            IF @metacritic <> 0 THEN
                SET @new_avg = (SELECT AVG(metacritic)
                                FROM Publish p JOIN Gameinfo g ON p.gameid = g.queryid
                                WHERE p.publishername = new.publishername AND metacritic <> 0
                                GROUP BY p.publishername);
                UPDATE Publisher SET avgmetacritic = @new_avg WHERE publishername = new.publishername;
            END IF;
        END
        """

        q_pd = """
        CREATE TRIGGER Publish_Delete
        AFTER DELETE ON Publish
            FOR EACH ROW
        BEGIN
            SET @gamecnt = (SELECT gamecount
                            FROM Publisher p 
                            WHERE p.publishername = old.publishername);
            UPDATE Publisher SET gamecount = @gamecnt - 1 WHERE publishername = old.publishername;
            SET @metacritic = (SELECT metacritic
                                FROM Gameinfo
                                WHERE queryid = old.gameid);
            IF @metacritic <> 0 THEN
                SET @new_avg = (SELECT AVG(metacritic)
                                FROM Publish p JOIN Gameinfo g ON p.gameid = g.queryid
                                WHERE p.publishername = old.publishername AND metacritic <> 0
                                GROUP BY p.publishername);
                UPDATE Publisher SET avgmetacritic = @new_avg WHERE publishername = old.publishername;
            END IF;
        END
        """

        q_gu = """
        CREATE TRIGGER Gameinfo_update
        AFTER UPDATE ON Gameinfo
            FOR EACH ROW
        BEGIN
            DECLARE done int default 0;
            DECLARE name VARCHAR(255);
            DECLARE dev_cur CURSOR FOR 
                SELECT developername
                FROM Develop
                WHERE gameid = new.queryid;
            DECLARE pub_cur CURSOR FOR 
                SELECT publishername
                FROM Publish
                WHERE gameid = new.queryid;
            DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = 1;

            OPEN dev_cur;
            REPEAT
                FETCH dev_cur INTO name;
                IF old.metacritic <> new.metacritic THEN
                    SET @dev_avg = (SELECT AVG(metacritic)
                                    FROM Develop d JOIN Gameinfo g ON d.gameid = g.queryid
                                    WHERE d.developername = name AND metacritic <> 0
                                    GROUP BY d.developername);
                    UPDATE Developer SET avgmetacritic = @dev_avg WHERE developername = name;
                END IF;
            UNTIL done END REPEAT;
            CLOSE dev_cur;
            SET done = 0;
            OPEN pub_cur;
            REPEAT
                FETCH pub_cur INTO name;
                IF old.metacritic <> new.metacritic THEN
                    SET @pub_avg = (SELECT AVG(metacritic)
                                    FROM Publish p JOIN Gameinfo g ON p.gameid = g.queryid
                                    WHERE p.publishername = name AND metacritic <> 0
                                    GROUP BY p.publishername);
                    UPDATE Publisher SET avgmetacritic = @pub_avg WHERE publishername = name;
                END IF;
            UNTIL done END REPEAT;
            CLOSE pub_cur;
        END
        """
        return self.execute(q_di) and self.execute(q_du) and self.execute(q_dd) and self.execute(q_pi) and self.execute(q_pu) and self.execute(q_pd) and self.execute(q_gu)

if __name__=="__main__":
    db = MyDatabase("yanxinl4", "123456")
    # result = db.search_by_keyword("red")
    # result = db.search_by_filter("action", "singleplayer", "windows", "Chinese", 10, 5, 0, 0, 20)
    # db.add_review(1, 39800, "It is a good game! My son plays it everyday.")
    # result = db.get_gamereview(39800)
    # result = db.create_trigger()
    # print(result)
    # q = "SELECT ROUTINE_DEFINITION FROM information_schema.ROUTINES WHERE SPECIFIC_NAME='UpdatePublisherGameCount'"
    # q = "SELECT SPECIFIC_NAME FROM information_schema.ROUTINES"
    # q = "DROP PROCEDURE UpdatePublisherGameCount"
    # q = "SHOW TRIGGERS"
    # q = "select trigger_schema, trigger_name, action_statement from information_schema.triggers"
    # q = "select trigger_schema, trigger_name from information_schema.triggers"
        
    # q1 = "INSERT INTO Gameinfo(queryid, queryname, metacritic) VALUES(989898, 'game for test', 5)"
    # q2 = "INSERT INTO Developer VALUES('developer for test', 0, 0)"
    # q3 = "INSERT INTO Develop VALUES('developer for test', 989898)"
    # self.create_trigger()
    # print(self.get_gameinfo(989898))
    # q4 = "UPDATE Gameinfo SET metacritic = 1 WHERE queryid = 989898"
    # self.execute(q4)
    # print(self.get_gameinfo(989898))
    # q = "SELECT * FROM Developer WHERE developername = 'developer for test'"
    # print(self.query(q))
    print(db.create_procedure())
    print(db.call_procedure())
    # print(db.get_gamepub(1))
    # db.valid_dev("queen")
    # db.valid_pub("queen")
    # q = "SELECT * FROM Developer WHERE developername = 'queen'"
    # print(db.query(q))
    # q = "SELECT * FROM Publisher WHERE publishername = 'queen'"
    # print(db.query(q))
    # db.add_newgame("Right eye is for remembering you", "king", "king", "https://th.bing.com/th/id/R.4772001b467b480cd3579e97bafb352f?rik=gj148TFTcf7gtA&riu=http%3a%2f%2fwww.hdwallpaper.nu%2fwp-content%2fuploads%2f2015%2f02%2fFunny-Cat-Hidden.jpg&ehk=U6Cjoa2RqEoCWgZC2srK9CGyrzRrc1MX%2fh9lzuae7K0%3d&risl=&pid=ImgRaw&r=0", "casual", "windows", "Chinese")
    # print(db.get_gameinfo(989900))
    # print(db.get_gamedev(989900))
    # print(db.get_gamepub(989900))
    
    
