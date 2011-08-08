from flask import Flask, render_template, jsonify
from flaskext.sqlalchemy import SQLAlchemy

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:////Users/nickreid/Documents/craigslist_maps/jobmaps/test.db'
db = SQLAlchemy(app)

from models import *

@app.route('/')
def index():
	return render_template('index.html')

@app.route('/types')
def get_types():
	posts = Post.query.all()
	types = []
	for post in posts:
		if post.post_type not in types:
			types.append(post.post_type)
	return jsonify(types = types)

@app.route('/posts')
def get_jobs():
	jobs = len(Post.query.all())
	return jsonify(total = jobs)