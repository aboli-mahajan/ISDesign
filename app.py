from flask_pymongo import PyMongo
from flask import Flask, render_template, url_for, request, session, redirect
import bcrypt
import string
import random

app = Flask(__name__)

app.config['MONGO_DBNAME'] = 'isdesign'
app.config['MONGO_URI'] = 'mongodb+srv://demo:demo123@cluster0-kmntv.mongodb.net/isdesign?retryWrites=true'

mongo = PyMongo(app)

def generateKey():
    return ''.join(random.choice(string.ascii_lowercase + string.digits) for _ in range(6))

@app.route('/')
def index():
    AustinApartments = fetch_apartments({'city': 'Austin'})
    MiamiApartments = fetch_apartments({'city': 'Miami'})
    NycApartments = fetch_apartments({'city': 'New York'})
    SfApartments = fetch_apartments({'city': 'San Francisco'})
    return render_template('index.html', AustinApartments=AustinApartments, MiamiApartments=MiamiApartments, NycApartments=NycApartments, SfApartments=SfApartments)

@app.route('/signup')
def signup():
    return render_template('register.html')

@app.route('/login')
def login():
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

@app.route('/file/<filename>')
def file(filename):
    return mongo.send_file(filename)

@app.route('/addapartments', methods=['GET', 'POST'])
def addapartments():
    if request.method == 'POST':
        request_params = {}
        request_params['city'] = request.form['city']
        request_params['title'] = request.form['title']
        request_params['bedrooms'] = int(request.form['bedrooms'])
        request_params['price_range'] = request.form['price_range']
        if 'furnished' in request.form:
            request_params['furnished'] = True
        else:
            request_params['furnished'] = False
        request_params['apartmentKey'] = generateKey()

        if 'photo' in request.files:
            photo = request.files['photo']
            mongo.save_file(photo.filename, photo)
            request_params['image_name'] = photo.filename
            mongo.db.apartments.insert(request_params)

    if request.method == 'GET':
        return render_template('add_apartments.html')
    return render_template('index.html')

@app.route('/apartments')
def apartments():
    # Does not work
    AustinApartments = fetch_apartments({'city':'Austin'})
    length = AustinApartments.count()
    return render_template('apartments.html', AustinApartments=AustinApartments, length=length)

def fetch_apartments(params):
    apartmentsList = mongo.db.apartments.find(params)
    return apartmentsList

if __name__ == '__main__':
    app.run()

app.secret_key = 'mysecret'
