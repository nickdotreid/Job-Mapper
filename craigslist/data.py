import urllib
from xml.dom.minidom import parseString
import re

def get_XML(source):
	feed = urllib.urlopen(source)
	return parseString(feed.read())

def parse_jobs(xml):
	jobs = []
	items = xml.getElementsByTagName('item')
	for node in items:
		job = {}
		job['title'] = node.getElementsByTagName('title')[0].firstChild.data
		parts = re.split('\(',job['title'])
		if len(parts)>0:
			job['neighborhood'] = parts.pop().rstrip(')')
			print job['neighborhood']
		job['link'] = node.getElementsByTagName('link')[0].firstChild.data
		link_parts = re.split('/',job['link'].lstrip('http://').rstrip('.html'))
		if link_parts[3]:
			job['id'] = link_parts[3]
		if link_parts[2]:
			job['type'] = link_parts[2]
		if link_parts[1]:
			job['city'] = link_parts[1]
		jobs.append(job)
	return jobs