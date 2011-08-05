from craigsuck import craigslist
import re

listings = ['http://sfbay.craigslist.org/acc/','http://sfbay.craigslist.org/ofc/','http://sfbay.craigslist.org/egr/']

def parse_craigslist_post(post):
	if post['title']:
		parts = re.split('\(',post['title'])
		if len(parts)>0:
			post['neighborhood'] = parts.pop().rstrip(')')
	if post['link']:
		link_parts = re.split('/',post['link'].lstrip('http://').rstrip('.html'))
		if link_parts[3]:
			post['id'] = link_parts[3]
		if link_parts[2]:
			post['type'] = link_parts[2]
		if link_parts[1]:
			post['city'] = link_parts[1]
		if link_parts[0]:
			post['source'] = link_parts[0]
	return post

def save_post(post):
	#if post id does not exist // save it
	return True
	
def query_craigslist(listings):
	posts = craigslist.fetch_all(listings)
	for post in posts:
		parsed = parse_craigslist_post(post)
		save_post(parsed)
		print parsed