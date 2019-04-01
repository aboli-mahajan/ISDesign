from flask import Flask
from flask_pymongo import PyMongo
from flask import Flask, render_template, url_for, request, session, redirect

import bcrypt

app = Flask(__name__)

app.config['MONGO_DBNAME'] = 'isdesign'
app.config['MONGO_URI'] = 'mongodb+srv://demo:demo123@cluster0-kmntv.mongodb.net/isdesign?retryWrites=true'

mongo = PyMongo(app)

@app.route('/')
def index():
    return render_template('home.html')

@app.route('/signup')
def signup():
    return render_template('register.html')

@app.route('/login', methods=['POST','GET'])
def login():
    if request.method == 'POST':
        users = mongo.db.users
        login_user = users.find_one({'email': request.form['username']})

        if login_user:
            if bcrypt.hashpw(request.form['pass'].encode('utf-8'), login_user['password']) == login_user['password']:
                session['email'] = request.form['username']
                return redirect(url_for('index'))
        return 'invalid user'

    return render_template('login.html')


@app.route('/register', methods=['POST', 'GET'])
def register():
    if request.method == 'POST':
        users = mongo.db.users
        existing_user = users.find_one({'email': request.form['email']})

        if existing_user is None:
            hashpass = bcrypt.hashpw(request.form['password'].encode('utf-8'), bcrypt.gensalt())
            users.insert({'email': request.form['email'], 'password': hashpass})
            session['email'] = request.form['email']
            return redirect(url_for('index'))

        return 'That email already exists!'

    return render_template('register.html')

@app.route('/apartments', methods=['GET'])
def apartments():
    # if request.method == 'GET':
    #     request_params = {}
    #     if 'city' in register.form:
    #         request_params['city'] = request.form['city']
    #     request_params['bedrooms'] = request.form['bedrooms']
    #     request_params['price_range'] = request.form['price_range']
    #     request_params['furnished'] = request.form['furnished']
    #     request_params['apartmentKey'] = request.form['apartmentKey']
    #     request_params['title'] = request.form['title']
    #     apartmentsList = mongo.db.apartments.find(request_params)
    return render_template('apartments.html')

if __name__ == '__main__':

    app.run()

app.secret_key = 'mysecret1'