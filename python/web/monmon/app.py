from flask import Flask, render_template
import sqlite3
import random as r

app = Flask(__name__)

def get_data():
	#connect = sqlite3.connect("/home/guardcat/dbs/money/money.db")
	#cursor = connect.cursor()
	#cursor.execute("SELECT * from v_by_bud_html")
	#data = cursor.fetchall()
	#connect.close()
	data = [
		("Питание", r.randrange(1000, 1000000)),
		("Проезд", r.randrange(1000, 1000000)),
		("Фонд жилья", r.randrange(1000, 1000000))
	]
	return data

def format_data(arr):
	res = []
	names = {
		"Фонд жилья": "Отложено"
	}
	for el in arr:
		l_res = []
		if el[0] in names:
			l_res.append(names[el[0]])
		else:
			l_res.append(el[0])
		l_res.append(f"{el[1]:_.0f}".replace("_", " "))
		res.append(l_res)
	return res

@app.route('/Hdhfbmbkhuk83yhsjdsbfmnb--sdLLlksdjsdjkfjkfdsjljdl')
def home():
	data = format_data(get_data())
	return render_template("index.html", data=data, date="26.02.2025")

app.run()