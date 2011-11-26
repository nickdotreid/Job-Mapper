from jobapp import db
import datetime

def init_db():
	db.drop_all()
	db.create_all()
	
class PostCount(db.Model):
	id = db.Column(db.Integer,primary_key=True)
	post_type_id = db.Column(db.Integer)
	region_id = db.Column(db.Integer)
	count = db.Column(db.Integer)
	date = db.Column(db.DateTime,nullable=True)
	
	def __init__(self,count,post_type_id,region_id,date):
		self.count = count
		self.date = date
		self.region_id = region_id
		self.post_type_id = post_type_id
		
	def __repr__(self):
		return '<Count %r>' % self.count

		
class PostType(db.Model):
	id = db.Column(db.Integer,primary_key=True)
	short = db.Column(db.String(10))
	name = db.Column(db.String(200), nullable=True)
	posts = db.relationship('Post',backref='post_type',lazy="dynamic")
	
	def __init__(self,short):
		self.short = short
	
	def __repr__(self):
		return '<Type %r>' % self.short

region_to_posts = db.Table('region_to_posts',
	db.Column('region_id', db.Integer, db.ForeignKey('region.id')),
	db.Column('post_id', db.Integer, db.ForeignKey('post.id'))
	)

region_to_parent = db.Table('region_to_parent',
	db.Column('region_id',db.Integer,db.ForeignKey('region.id')),
	db.Column('parent_id',db.Integer,db.ForeignKey('region.id'))
	)


class Region(db.Model):
	id = db.Column(db.Integer, primary_key=True)
	short = db.Column(db.String(80))
	name = db.Column(db.String(200), nullable=True)
	
	posts = db.relationship('Post',secondary=region_to_posts,backref=db.backref('posts',lazy='dynamic'))
	
	parent_id = db.Column(db.Integer, db.ForeignKey('region.id'))
	children = db.relationship("Region",
		lazy="joined",
		join_depth=2)
	
	def __init__(self,short):
		self.short = short
	
	def __repr__(self):
		return '<Region %r>' % self.short

class Post(db.Model):
	id = db.Column(db.Integer, primary_key=True)
	post_id = db.Column(db.String(120))

	post_date = db.Column(db.DateTime)
	remove_date = db.Column(db.DateTime, nullable=True)

	title = db.Column(db.String(500))
	link = db.Column(db.String(300))
	
	post_type_id = db.Column(db.Integer, db.ForeignKey('post_type.id'))
	
	source = db.relationship('Region',uselist=False ,secondary=region_to_posts, backref=db.backref('source',lazy='dynamic'))
	region = db.relationship('Region',uselist=False ,secondary=region_to_posts, backref=db.backref('region',lazy='dynamic'))
	section = db.relationship('Region',uselist=False ,secondary=region_to_posts, backref=db.backref('section',lazy='dynamic'))
	
	def __init__(self, post_id, post_date=datetime.datetime.now(), title='test', link='http://sfbay.craigslist.org'):
		self.post_id = post_id
		
		self.post_date = post_date
		self.title = title
		self.link = link

	def __repr__(self):
		return '<Post %r>' % self.post_id
		