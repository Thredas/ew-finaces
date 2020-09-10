import os
from datetime import datetime, timedelta

from flask import Flask, request, jsonify
from flask_migrate import Migrate
from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import check_password_hash, generate_password_hash
import jwt

app = Flask(__name__)
db = SQLAlchemy()

basedir = os.path.abspath(os.path.dirname(__file__))
app.config['CSRF_ENABLED'] = True
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///' + os.path.join(basedir, 'database.db')
app.config['SQLALCHEMY_MIGRATE_REPO'] = os.path.join(basedir, 'db_repository')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db.init_app(app)
migrate = Migrate(app, db)


from models import *


# @app.route('/api/register', methods=['GET'])
# def register():
#     from models import User
#     secure_password = generate_password_hash('Kerter2013')
#     new_user = User(login="thredas", password=secure_password)
#     db.session.add(new_user)
#     db.session.commit()


JWT_SECRET = 'ew-finance-secret-key'
ENCODING = 'HS256'


def check_token(data):
    token = data.replace('b\'', '').replace('\'', '')

    if not token:
        return 'Токен не прошел проверку'

    user = User.query.filter_by(id=jwt.decode(token, JWT_SECRET, ENCODING)["user_id"]).first()

    if not user:
        return 'Токен не прошел проверку'

    return user


@app.route('/api/auth/login', methods=['POST'])
def login():
    data = request.json
    login_text = data['login']
    password = data['password']

    user = User.query.filter_by(login=login_text).first()

    if not user:
        return {'message': 'Пользователя не существует'}, 400

    if not check_password_hash(user.password, password):
        return {'message': 'Неправильный пароль'}, 400

    jwt_token = jwt.encode({'user_id': user.id}, JWT_SECRET, ENCODING)
    print(jwt_token)
    return {'token': str(jwt_token), 'user_id': user.id}


@app.route('/api/reports', methods=['GET', 'POST'])
def reports():
    if request.method == 'GET':
        data = str(request.headers['Authorization'])
        middleware = check_token(data)

        if type(middleware) is not str:
            user = middleware
        else:
            return {'message': middleware}, 401

        db_reports = Report.query.filter_by(user_id=user.id).order_by(Report.id.desc()).all()
        payload = []

        for report in db_reports:
            payload.append({
                'id': report.id,
                'state': eval(report.state)
            })

        return {'reports': payload}

    if request.method == 'POST':
        data = request.json
        middleware = check_token(request.headers['Authorization'])

        if type(middleware) is not str:
            user = middleware
        else:
            return {'message': middleware}, 401

        new_report = Report(user_id=user.id, state=str(data))
        db.session.add(new_report)
        db.session.commit()

        return {'report': new_report.id}


@app.route('/api/reports/<report_id>', methods=['GET', 'DELETE', 'POST'])
def report(report_id):
    if request.method == 'GET':
        data = str(request.headers['Authorization'])
        middleware = check_token(data)

        if type(middleware) is str:
            return {'message': middleware}, 401

        db_report = Report.query.filter_by(id=report_id).first()

        return {'state': eval(db_report.state)}

    if request.method == 'POST':
        data = request.json
        middleware = check_token(request.headers['Authorization'])

        if type(middleware) is str:
            return {'message': middleware}, 401

        db_report = Report.query.filter_by(id=report_id).first()
        db_report.state = str(data)

        db.session.commit()

        return {'report': db_report.id}

    if request.method == 'DELETE':
        middleware = check_token(request.headers['Authorization'])

        if type(middleware) is str:
            return {'message': middleware}, 401

        Report.query.filter_by(id=report_id).delete()
        db.session.commit()

        return {'message': 'Deleted'}
