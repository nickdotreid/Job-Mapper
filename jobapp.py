from flask import Flask, render_template
from flaskext.sqlalchemy import SQLAlchemy

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:////Users/nickreid/Documents/craigslist_maps/jobmaps/test.db'
db = SQLAlchemy(app)

@app.route('/')
def index():
	return render_template('index.html')