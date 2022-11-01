from app import get_app
from os import environ

if __name__ == '__main__':
    import routes
    debug = True if environ.get('FLASK_ENV') == 'development' else False
    get_app().run(host="0.0.0.0", port=5100, debug=debug)
