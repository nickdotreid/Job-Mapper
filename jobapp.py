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
	if request.method == "POST" and 'region' in request.form and 'types' in request.form:
		posts = Region.query.filter_by(short=request.form['region']).first().posts
		type_list = re.split(',',request.form['types'])
		for short in type_list:
			post_type = PostType.query.filter_by(short=short).first()
			count = 0
			for post in posts:
				if post_type == post.post_type:
					count += 1
			response_types[short] = count
			total += count
	return jsonify(total = total,types = response_types)
	
@app.route('/regions',methods=['GET','POST'])
def get_regions():
	regions = []
	if request.method == "POST" and 'term' in request.form:
		exp = re.compile(request.form['term'])
		for region in Region.query.all():
			if exp.search(region.short):
				regions.append(region.short)
	return jsonify(regions = regions)