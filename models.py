from jobapp import db
import datetime

def init_db():
	db.drop_all()
	db.create_all()

class Post(db.Model):
	id = db.Column(db.Integer, primary_key=True)
	post_id = db.Column(db.String(120))
	post_type = db.Column(db.String(10))
	
	post_date = db.Column(db.DateTime)
	remove_date = db.Column(db.DateTime, nullable=True)
	
	title = db.Column(db.String(500))
	link = db.Column(db.String(300))
	
	source = db.Column(db.String(100))
	city = db.Column(db.String(300))
	neighborhood = db.Column(db.String(300))

	def __init__(self, post_id, post_type='test', post_date=datetime.datetime.now(), link='http://sfbay.craigslist.org', source='test source', city='test city', neighborhood='test neighborhood'):
		self.post_id = post_id
		self.post_type = post_type
		self.post_date = post_date
		self.link = link
		self.source = source
		self.city = city
		self.neighborhood = neighborhood

	def __repr__(self):
		return '<Post %r>' % self.post_id+" "+self.post_type