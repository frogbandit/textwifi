import json
from flask import Flask, render_template
from wifi_positioning_system import getWifi
import time

app = Flask(__name__)
app.config.update(
	DEBUG=True,
	SECRET_KEY='TWITTMAP'
)

'''
Loads webpage
'''
@app.route('/', methods=['GET', 'POST'])
def index():
	return render_template('index.html')


'''
Returns wifi around a given user's location
'''
@app.route('/generateWifi', methods=['GET', 'POST'])
def generateWifi():
	result = getWifi()
	return json.dumps(result)

if __name__ == '__main__':
	app.run()
