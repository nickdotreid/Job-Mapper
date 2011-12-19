from models import *
	
types = PostType.query.all()
regions = Region.query.filter_by(published=True).all()

for region in regions:
	print "*****"
	posts = region.posts
	post_count = PostCount(len(posts),None,region.id,None)
	db.session.add(post_count)
	db.session.commit()
	print str(post_type.name)+"--"+str(post_count.count)
	count_types = {}
	for post_type in types:
		count_types[post_type.short] = 0
	for post in posts:
		if post.post_type:
			count_types[post.post_type.short] += 1
	for post_type in types:
		count = count_types[post_type.short]
		post_count = PostCount(count,post_type.id,region.id,None)
		print str(post_type.name)+"--"+str(post_count.count)
		db.session.add(post_count)
		db.session.commit()