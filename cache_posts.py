from models import *

def count_posts(post_type,region):
	posts = Post.query.filter_by(post_type=post_type).filter_by(post_type=post_type).all()
	return len(posts)
	
types = PostType.query.all()
regions = Region.query.all()

for region in regions:
	print region.short
	for post_type in types:
		print post_type.name
		#check for existing post_count & update or create new
		post_count = PostCount(count_posts(post_type,region),post_type.id,region.id,None)
		db.session.add(post_count)
		db.session.commit()