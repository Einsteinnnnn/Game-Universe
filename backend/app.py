import re
import sys
from flask import Flask, request, session
from config import env
from datetime import timedelta
from database import MyDatabase

if env == 'dev' or env == 'staging':
    app = Flask(__name__, static_folder='static', static_url_path='/')
else:
    app = Flask(__name__, static_folder='static_prod', static_url_path='/')
app.config['SECRET_KEY'] = 'GameUniverse'
app.config['PERMANENT_SESSION_LIFETIME'] = timedelta(days=7)

if env == 'dev' or env == 'staging':
    if len(sys.argv) < 2:
        sys.exit('Include netid as database username. Usage: $ python app.py [netid]')
    my_database = MyDatabase(username=sys.argv[1], password='123456')
else:
    my_database = MyDatabase(username='liyi3', password='123456')
if not my_database.is_connected():
    sys.exit('Failed to connect to database. Check your username and password.')


@app.errorhandler(404)
def index(e):
    return app.send_static_file('index.html')


@app.route('/api/login', methods=['POST'])
def login():
    post_data = request.get_json()
    try:
        username = post_data['username']
        password = post_data['password']
    except KeyError:
        return {'status': 'error', 'message': 'Invalid request.'}
    check = my_database.user_login(username, password)
    if check:
        uid = my_database.username_check(username)[0][0]
        session['uid'] = uid
        return {'status': 'ok'}
    else:
        return {'status': 'error', 'message': 'Invalid username or password.'}


@app.route('/api/logout', methods=['POST'])
def logout():
    session.pop('uid', None)
    return {'status': 'ok'}


@app.route('/api/user', methods=['GET'])
def user_info():
    if 'uid' not in session:
        return {'status': 'error', 'message': 'Login required.'}
    uid = session['uid']
    result = my_database.get_userinfo(uid)
    if result:
        return {'status': 'ok', 'data': result}
    else:
        return {'status': 'error', 'message': 'Invalid username.'}


@app.route('/api/register', methods=['POST'])
def register():
    post_data = request.get_json()
    try:
        username = post_data['username']
        password = post_data['password']
        email = post_data['email']
        phone = post_data['phone']
    except KeyError:
        return {'status': 'error', 'message': 'Invalid request.'}
    check = my_database.username_check(username)
    if check:
        return {'status': 'error', 'message': 'Username already exists.'}
    else:
        if my_database.user_register(username, password, email, phone):
            return {'status': 'ok'}
        else:
            return {'status': 'error', 'message': 'Failed to register.'}


@app.route('/api/basic-search', methods=['GET'])
def basic_search():
    keyword = request.args.get('keyword')
    if keyword:
        result = my_database.search_by_keyword(keyword)
        if result:
            return {'status': 'ok', 'data': result}
        else:
            return {'status': 'ok', 'data': []}
    else:
        return {'status': 'error', 'message': 'Invalid request.'}


@app.route('/api/advanced-search', methods=['POST'])
def advanced_search():
    post_data = request.get_json()
    try:
        genre = post_data['genre']
        category = post_data['category']
        os_platforms = post_data['os_platforms']
        language = post_data['language']
        required_age = post_data['required_age']
        metacritic_lowerbnd = post_data['metacritic_lowerbnd']
        steam_spy_owners = post_data['steamspyowners']
        price_lower = post_data['price'][0] * 10
        price_upper = post_data['price'][1] * 10
    except:
        return {'status': 'error', 'message': 'Invalid request.'}
    result = my_database.search_by_filter(genre, category, os_platforms, language, required_age, metacritic_lowerbnd,
                                          steam_spy_owners, price_lower, price_upper)
    if result:
        return {'status': 'ok', 'data': result}
    else:
        return {'status': 'ok', 'data': []}


@app.route('/api/favorite-games', methods=['GET'])
def favorite_games():
    if 'uid' not in session:
        return {'status': 'error', 'message': 'Login required.'}
    uid = session['uid']
    result = my_database.get_userfavorite(uid)
    if result:
        return {'status': 'ok', 'data': result}
    else:
        return {'status': 'ok', 'data': []}


@app.route('/api/favorite-games-add', methods=['POST'])
def favorite_games_add():
    if 'uid' not in session:
        return {'status': 'error', 'message': 'Login required.'}
    uid = session['uid']
    post_data = request.get_json()
    try:
        gameid = post_data['gameid']
    except:
        return {'status': 'error', 'message': 'Invalid request.'}
    try:
        if my_database.add_favorite(uid, gameid):
            return {'status': 'ok', 'message': 'Successfully added favorite game.'}
        else:
            return {'status': 'ok', 'message': 'This game is already in your favorite list.'}
    except:
        return {'status': 'ok', 'message': 'This game is already in your favorite list.'}


@app.route('/api/favorite-games-delete', methods=['POST'])
def favorite_games_delete():
    if 'uid' not in session:
        return {'status': 'error', 'message': 'Login required.'}
    uid = session['uid']
    post_data = request.get_json()
    try:
        gameid = post_data['gameid']
    except:
        return {'status': 'error', 'message': 'Invalid request.'}
    if my_database.delete_favorite(uid, gameid):
        return {'status': 'ok'}
    else:
        return {'status': 'error', 'message': 'Failed to delete favorite game.'}


@app.route('/api/game-info', methods=['GET'])
def game_info():
    gameid = request.args.get('gameid')
    if gameid:
        result = my_database.get_gameinfo(gameid)
        if result:
            return {'status': 'ok', 'data': result}
        else:
            return {'status': 'error', 'message': 'Invalid gameid.'}
    else:
        return {'status': 'error', 'message': 'Invalid request.'}


@app.route('/api/game-reviews', methods=['GET'])
def game_reviews():
    gameid = request.args.get('gameid')
    if gameid:
        result = my_database.get_gamereview(gameid)
        if result:
            return {'status': 'ok', 'data': result}
        else:
            return {'status': 'ok', 'data': []}
    else:
        return {'status': 'error', 'message': 'Invalid request.'}


@app.route('/api/game-reviews-add', methods=['POST'])
def game_reviews_add():
    if 'uid' not in session:
        return {'status': 'error', 'message': 'Login required.'}
    uid = session['uid']
    post_data = request.get_json()
    try:
        gameid = post_data['gameid']
        review = post_data['review']
        review = review.replace("'", "''")
    except:
        return {'status': 'error', 'message': 'Invalid request.'}
    if my_database.add_review(uid, gameid, review):
        return {'status': 'ok'}
    else:
        return {'status': 'error', 'message': 'Failed to add review.'}


@app.route('/api/game-reviews-delete', methods=['POST'])
def game_reviews_delete():
    if 'uid' not in session:
        return {'status': 'error', 'message': 'Login required.'}
    uid = session['uid']
    post_data = request.get_json()
    try:
        gameid = post_data['gameid']
        review = post_data['review']
        review = review.replace("'", "''")
    except:
        return {'status': 'error', 'message': 'Invalid request.'}
    if my_database.delete_review(uid, gameid, review):
        return {'status': 'ok'}
    else:
        return {'status': 'error', 'message': 'Failed to delete review.'}


@app.route('/api/game-reviews-update', methods=['POST'])
def game_reviews_update():
    if 'uid' not in session:
        return {'status': 'error', 'message': 'Login required.'}
    uid = session['uid']
    post_data = request.get_json()
    try:
        gameid = post_data['gameid']
        new_review = post_data['new_review']
        new_review = new_review.replace("'", "''")
    except:
        return {'status': 'error', 'message': 'Invalid request.'}
    if my_database.edit_review(uid, gameid, review=new_review):
        return {'status': 'ok'}
    else:
        return {'status': 'error', 'message': 'Failed to update review.'}


@app.route('/api/recommend', methods=['GET'])
def recommend():
    def sort_and_classify(data):
        top, bottom = [], []
        top_indicator = ['Great Hit', 'Growing Fandom', 'Cult Following']
        bottom_indicator = ['Starving', 'Half Dead', 'Dead Duck']
        for indicator in top_indicator:
            top += [item for item in data if item[4] == indicator]
        for indicator in bottom_indicator:
            bottom += [item for item in data if item[4] == indicator]
        return top, bottom
    # temporary, waiting for database
    result = my_database.call_procedure()
    result = sort_and_classify(result)
    if result:
        return {'status': 'ok', 'data': {'top': result[0], 'bottom': result[1]}}
    else:
        return {'status': 'ok', 'data': {'top': [], 'bottom': []}}


@app.route('/api/game-add', methods=['POST'])
def game_add():
    if 'uid' not in session:
        return {'status': 'error', 'message': 'Login required.'}
    uid = session['uid']
    username = my_database.get_userinfo(uid)[0][1]
    if username != 'admin':
        return {'status': 'error', 'message': 'Permission denied.'}
    post_data = request.get_json()
    print(post_data)
    name = post_data['name']
    developer = post_data['developer']
    publisher = post_data['publisher']
    genre = post_data['genre']
    img = post_data['img']
    os_platforms = post_data['platform']
    language = ' '.join(post_data['language'])
    if my_database.add_newgame(name, developer, publisher,  img, genre, os_platforms, language):
        return {'status': 'ok'}
    else:
        return {'status': 'error', 'message': 'Failed to add game.'}
    


@app.route('/api/game', methods=['GET'])
def game():
    def build_platform_string(win, mac, linux):
        result = []
        if win:
            result.append('Windows')
        if mac:
            result.append('Mac')
        if linux:
            result.append('Linux')
        return '/'.join(result)

    def build_genre_string(nongame, indie, action, adventure, casual, strategy, rpg, simulation, sports, racing):
        result = []
        if nongame:
            result.append('Nongame')
        if indie:
            result.append('Indie')
        if action:
            result.append('Action')
        if adventure:
            result.append('Adventure')
        if casual:
            result.append('Casual')
        if strategy:
            result.append('Strategy')
        if rpg:
            result.append('RPG')
        if simulation:
            result.append('Simulation')
        if racing:
            result.append('Racing')
        if sports:
            result.append('Sports')
        return ', '.join(result)
    
    def build_devpub_string(data):
        result = ['{} ({}, {})'.format(item[0], item[1], item[2]) for item in data]
        return ', '.join(result)

    gameid = request.args.get('gameid')
    try:
        gameid = int(gameid)
    except:
        return {'status': 'error', 'message': 'Invalid request.'}
    if gameid:
        result = my_database.get_gameinfo(gameid)[0]
        developer = my_database.get_gamedev(gameid)
        publisher = my_database.get_gamepub(gameid)
        if result:
            return {'status': 'ok', 'data': {
                'developer': build_devpub_string(developer) if developer else 'N/A',
                'publisher': build_devpub_string(publisher) if publisher else 'N/A',
                'supported_platform': build_platform_string(result[65], result[67], result[66]),
                'supported_language': result[32],
                'genre': build_genre_string(result[40], result[41], result[42], result[43], result[44], result[45], result[46], result[47], result[48], result[49]),
                'age_restriction': str(result[5]) + '+' if result[5] else 'No restriction',
                'description': result[24] if result[24] else 'This game is misterious and has no description.',
                'img': result[30],
                'original_price': result[20],
                'current_price': result[21],
                'name': result[2],
                'released': result[4] if result[4] else 'N/A',
                'meta_score': result[8] if result[8] else 'N/A',
                'recommendation': result[11] if result[11] else 'N/A',
            }}
        else:
            return {'status': 'error', 'message': 'Invalid gameid.'}
    else:
        return {'status': 'error', 'message': 'Invalid request.'}


if __name__ == '__main__':
    app.run(debug=True)
