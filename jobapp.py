from flask import Flask, render_template, jsonify
from flaskext.sqlalchemy import SQLAlchemy

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:////Users/nickreid/Documents/craigslist_maps/jobmaps/test.db'
db = SQLAlchemy(app)

from models import *

@app.route('/')
def index():
	return render_template('index.html')
	
@app.route('/jobs')
def get_jobs():
	jobs = len(Post.query.all())
	return jsonify(total = jobs)