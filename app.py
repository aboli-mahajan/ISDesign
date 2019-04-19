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
@app.route('/index')
def index():

    AustinApartments = fetch_apartments({'city': 'Austin'})
    MiamiApartments = fetch_apartments({'city': 'Miami'})
    NycApartments = fetch_apartments({'city': 'New York'})
    SfApartments = fetch_apartments({'city': 'San Francisco'})
    return render_template('index.html', AustinApartments=AustinApartments, MiamiApartments=MiamiApartments, NycApartments=NycApartments, SfApartments=SfApartments)


@app.route('/aboutus')
def aboutus():
    return  render_template('aboutus.html')


@app.route('/signup')
def signup():
    return render_template('signup.html')


<<<<<<< HEAD
=======
@app.route('/userprofile', methods=['GET', 'POST'])
def userprofile():
    if request.method == 'POST':
        user = mongo.db.users.find_one({'email': session['email']})
        mongo.db.users.update_one({"email": session['email']}, {"$set": {"first_name": request.form['f_name'], "last_name": request.form['l_name'],"email": request.form['email_id'], "location": request.form['location']}})
        current_user = mongo.db.users.find_one({'email': session['email']})
        return render_template('userprofile.html', user=current_user)
    if request.method == 'GET':
        current_user = mongo.db.users.find_one({'email': session['email']})
        return render_template('userprofile.html', user=current_user)

    return render_template('userprofile.html')

@app.route('/bio')
def bio():
    return render_template('bio.html')

>>>>>>> 8a94702509596aae26ad998a49aa8fc106a98d7c
@app.route('/login', methods=['POST','GET'])
def login():
    if request.method == 'POST':
        users = mongo.db.users
        login_user = users.find_one({'email': request.form['username']})

        if login_user:
            if bcrypt.hashpw(request.form['pass'].encode('utf-8'), login_user['password']):
                session['email'] = request.form['username']
                session['first_name'] = login_user['first_name']

                return redirect(url_for('index'))
        return render_template('notfound.html')

    return render_template('login.html')

@app.route('/register', methods=['POST', 'GET'])
def register():
    if request.method == 'POST':
        users = mongo.db.users
        existing_user = users.find_one({'email': request.form['email']})

        if existing_user is None:
            request_params={}
            hashpass = bcrypt.hashpw(request.form['password'].encode('utf-8'), bcrypt.gensalt())

            session['email'] = request.form['email']
            session['first_name'] = request.form['first_name']
            if 'photo' in request.files:
                photo = request.files['photo']
                mongo.save_file(photo.filename, photo)
                mongo.db.users.insert({'email': request.form['email'], 'password': hashpass, 'first_name': request.form['first_name'], 'last_name': request.form['last_name'], 'photo': photo.filename})

            mongo.db.users.insert({'email': request.form['email'], 'password': hashpass, 'first_name': request.form['first_name'], 'last_name': request.form['last_name'], 'photo': 'None'})
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
        if request.form['furnished'] == 'yes':
            request_params['furnished'] = True
        else:
            request_params['furnished'] = False
        request_params['apartmentKey'] = generateKey()

        if 'photo' in request.files:
            photo = request.files['photo']
            mongo.save_file(photo.filename, photo)
            request_params['image_name'] = photo.filename
            mongo.db.apartments.insert(request_params)

        apartmentsList = fetch_apartments({})
        length = apartmentsList.count()
        return render_template('apartments.html', apartmentsList=apartmentsList, length=length)

    return render_template('index.html')


@app.route("/logout")
def logout():
    if session:
        session.clear()
        return redirect(url_for('login'))

@app.route('/apartments', methods=['GET', 'POST'])
def apartments():
    request_params = {}
    if request.method == 'POST':
        request_params['city'] = str(request.form['city'])
        bedrooms = []
        for i in request.form.getlist('bedrooms'):
            bedrooms.append(int(i))
        price_range = []
        for i in request.form.getlist('price'):
            price_range.append(str(i))
        request_params['bedrooms'] = {"$in": bedrooms}
        request_params['price_range'] = {"$in": price_range}
        if int(request.form['furnished']) == 1:
            request_params['furnished'] = True
        else:
            request_params['furnished'] = False
    apartmentsList = fetch_apartments(request_params)
    length = apartmentsList.count()
    return render_template('apartments.html', apartmentsList=apartmentsList, length=length)


def fetch_apartments(params):
    apartmentsList = mongo.db.apartments.find(params)
    return apartmentsList


@app.route('/roommates')
def roommates():
    roommatesList = fetch_roommates({})
    length = roommatesList.count()
    return render_template('roommates.html', roommatesList=roommatesList, length=length)


def fetch_roommates(params):
    roommatesList = mongo.db.users.find(params)
    return roommatesList


@app.route('/bio')
def bio():
    return render_template('bio.html')


if __name__ == '__main__':
    app.run()

app.secret_key = 'mysecret1'


