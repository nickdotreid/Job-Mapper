import urllib
from xml.dom.minidom import parseString

def get_XML(source):
	feed = urllib.urlopen(source)
	return parseString(feed.read())

def parse_jobs(xml):
	jobs = []
	items = dom.getElementsByTagName('item')
	for node in items:
		print node
	return jobs
	