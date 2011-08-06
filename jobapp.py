from flask import Flask
from flaskext.sqlalchemy import SQLAlchemy

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:////Users/nickreid/Documents/craigslist_maps/jobmaps/test.db'
db = SQLAlchemy(app)