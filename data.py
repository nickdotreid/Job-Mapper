from models import *
from craigsuck import craigslist
import re
import time
from datetime import datetime

listings = ['http://sfbay.craigslist.org/acc/','http://sfbay.craigslist.org/ofc/','http://sfbay.craigslist.org/egr/']

def parse_craigslist_post(post):
	if post['title']:
		parts = re.split('\(',post['title'])
		if len(parts)>0:
			post['neighborhood'] = parts.pop().rstrip(')')
	if post['link']:
		link_parts = re.split('/',post['link'].lstrip('http://').rstrip('.html'))
		if link_parts[3]:
			post['post_id'] = link_parts[3]
		if link_parts[2]:
			post['post_type'] = link_parts[2]
		if link_parts[1]:
			post['city'] = link_parts[1]
		if link_parts[0]:
			post['source'] = link_parts[0]
	if post['date']:
		d = time.strptime(post['date'][0:len(post['date'])-6],'%Y-%m-%dT%H:%M:%S')
		post['post_date'] = datetime.fromtimestamp(time.mktime(d))
	return post

def save_post(post):
	if Post.query.filter_by(post_id=post['post_id']).first() is None:
		item = Post(post['post_id'],post['post_type'],post['post_date'],post['link'],post['source'],post['city'],post['neighborhood'])
		db.session.add(item)
		db.session.commit()
		return True
	return False
def query_craigslist(listings):
	posts = craigslist.fetch_all(listings)
	for post in posts:
		parsed = parse_craigslist_post(post)
		if save_post(parsed):
			print parsed