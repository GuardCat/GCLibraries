from flask import Flask, render_template
import sqlite3
import random as r

app = Flask(__name__)
app.config['TEMPLATES_AUTO_RELOAD'] = True


def get_data():
	res = {}
	connect = sqlite3.connect("/home/guardcat/dbs/money/money.db")
	cursor = connect.cursor()
	cursor.execute("SELECT * from v_by_bud_html")
	res["data"] = cursor.fetchall()
	cursor.execute("SELECT MAX(date) from transact")
	res["date"] = cursor.fetchall()
	cursor.execute("SELECT name, sum(real_sum) FROM transact INNER JOIN accounts ON account_id = accounts.id WHERE account_id = '5'")
	res["balance"] = cursor.fetchall()
	connect.close()
	'''
	res["data"] = [
		("Питание", r.randrange(1000, 1000000)),
		("Проезд", r.randrange(1000, 1000000)),
		("Фонд жилья", r.randrange(1000, 1000000))
	]
	res["date"] = [("2025-02-25")]
	res["balance"] = [("Сбер Моментум", r.randrange(1000, 1000000))]
	return res
	'''

def format_data(arr):
	res = []
	names = {
		"Фонд жилья": "Отложено",
		"Сбер Моментум": "Баланс на сбере"
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
	arr = get_data()
	arr["data"] = format_data(arr["data"])
	arr["balance"] = format_data(arr["balance"])
	date = ".".join(reversed(arr["date"][0].split("-")[1:]))
	return render_template("index.html", data=arr["data"], date=date, balance=arr["balance"])
app.run(port="8080", host="0.0.0.0")
