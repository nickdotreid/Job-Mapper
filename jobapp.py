from flask import Flask, request, render_template, jsonify
from flaskext.sqlalchemy import SQLAlchemy
import re

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

@app.route('/posts',methods=['GET','POST'])
def get_jobs():
	# should filter by city/neighborhood here
	posts = Post.query.all()
	response_types = {}
	if request.method == "POST" and 'types' in request.form:
		type_list = re.split(',',request.form['types'])
		for post_type in type_list:
			count = 0
			for post in posts:
				if post.post_type == post_type:
					count += 1
			response_types[post_type] = count
	return jsonify(total = len(posts),types = response_types)