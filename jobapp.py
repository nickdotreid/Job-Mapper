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
	types = []
	for post_type in PostType.query.all():
		types.append({
			'short':post_type.short,
			'name':post_type.name
		})
	return jsonify(types = types)

@app.route('/posts',methods=['GET','POST'])
def get_jobs():
	# should filter by city/neighborhood here
	posts = Post.query.all()
	response_types = {}
	total = 0
	if request.method == "POST" and 'types' in request.form:
		type_list = re.split(',',request.form['types'])
		for short in type_list:
			post_type = PostType.query.filter_by(short=short).first()
			if post_type:
				count = len(post_type.posts.all())
				response_types[short] = count
				total += count
	return jsonify(total = total,types = response_types)