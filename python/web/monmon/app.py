from flask import Flask, render_template, url_for
import sqlite3

app = Flask(__name__)

def getdata():
	#connect = sqlite3.connect("/home/guardcat/dbs/money/money.db")
	#cursor = connect.cursor()
	#cursor.execute("SELECT * from v_by_bud_html")
	#data = cursor.fetchall()
	#connect.close()
	data = [
		("Питание", 12000),
		("Проезд", 1000),
		("Отложено", 10000)
	]
	return data

@app.route('/Hdhfbmbkhuk83yhsjdsbfmnb--sdLLlksdjsdjkfjkfdsjljdl')
def home():
	return render_template("index.html", data=getdata(), date="26.02.2025")

app.run()