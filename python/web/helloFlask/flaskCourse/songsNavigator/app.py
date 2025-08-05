from flask import Flask

app = Flask(__name__)

@app.route('/')
@app.route('/index.html')
def index():
	return 'Hello world'

@app.route("/albums/<album_name>/<int:song_number>")
def albums(album_name, song_number):
	return f'The "{album_name}" album and the song number {song_number}'

if __name__ == '__main__':
	app.run(host='127.0.0.1', port=8090)
