from flask import Flask, request, render_template, jsonify
from flaskext.sqlalchemy import SQLAlchemy
import re

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql://root:root@localhost/jobmapper'
db = SQLAlchemy(app)

from models import *

@app.route('/')
def index():
	types = []
	for post_type in PostType.query.all():
		types.append({
			'short':post_type.short,
			'name':post_type.name,
			'id':post_type.id
		})
	return render_template('index.html',types=types)

@app.route('/posts',methods=['GET','POST'])
def get_jobs():
	posts = Post.query.all()
	response_types = []
	total = 0
	if request.method == "POST" and 'region' in request.form:
		region = Region.query.filter_by(short=request.form['region']).first()
		count_list = PostCount.query.filter_by(region_id=region.id).all()
		types = PostType.query.all()
		for post_type in types:
			post_count = None
			for count in count_list:
				if post_type and count.post_type_id == post_type.id:
					response_types.append({
						'short':post_type.short,
						'size':count.count,
						'name':post_type.name
					})
				if count.post_type_id == None:
					total = count.count
	return jsonify(total = total,types = response_types)
	
@app.route('/regions',methods=['GET','POST'])
def get_regions():
	regions = []
	if request.method == "POST" and 'term' in request.form:
		exp = re.compile(request.form['term'])
		for region in Region.query.filter_by(published=True).all():
			if exp.search(region.short):
				regions.append(region.short)
	return jsonify(regions = regions)