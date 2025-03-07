from flask import Flask, render_template, url_for
import sqlite3
import random as r

app = Flask(__name__)
app.config['TEMPLATES_AUTO_RELOAD'] = True


def get_data(view='v_by_bud_html', fetch_all = False):
    res = {}
    one_account = """
        SELECT name, sum(real_sum)
        FROM transact
        INNER JOIN accounts ON account_id = accounts.id
        WHERE account_id = '5'
    """
    all_accounts = """
        SELECT name, sum(real_sum) 
        FROM transact 
        INNER JOIN accounts ON account_id = accounts.id
        WHERE accounts.active = '1'
        GROUP BY accounts.id
    """
    connect = sqlite3.connect("/home/guardcat/dbs/money/money.db")
    cursor = connect.cursor()
    cursor.execute(f"SELECT * from {view}")
    res["data"] = cursor.fetchall()
    cursor.execute("SELECT MAX(date) from transact")
    res["date"] = cursor.fetchone()
    cursor.execute(all_accounts if fetch_all else one_account)
    res["balance"] = cursor.fetchall()
    connect.close()
    return res


def get_fake_data():
    res = {}
    res["data"] = [
        ("Питание", r.randrange(-10000, 100000)),
        ("Проезд", r.randrange(-10000, 100000)),
        ("На квартиру", r.randrange(-10000, 100000)),
        ("На одежду", r.randrange(-10000, 100000)),
        ("На отпуск", r.randrange(-10000, 100000)),
        ("Отложено", r.randrange(-10000, 100000))
    ]
    res["date"] = [("2025-02-25")]
    res["balance"] = [("Сбер Моментум", r.randrange(1000, 1000000))]
    return res

def format_data(arr, hide_them=True):
    res = []
    names = {
        "Фонд жилья": "Отложено",
        "Сбер Моментум": "Баланс на сбере"
    }
    to_hide = ["Стрижка Эрика"]
    for el in arr:
        l_res = []
        if el[0] in to_hide and hide_them:
            continue
        if el[0] in names:
            l_res.append(names[el[0]])
        else:
            l_res.append(el[0])
        l_res.append(f"{el[1]:_.0f}".replace("_", " ").replace("-0", "0"))
        res.append(l_res)
    
    return res

@app.route('/fake_data')
def fake():
    arr = get_fake_data()
    arr["data"] = format_data(arr["data"])
    arr["balance"] = format_data(arr["balance"])
    date = ".".join(reversed(arr["date"][0].split("-")[1:]))
    return render_template("min.html", data=arr["data"], date=date, balance=arr["balance"])

@app.route('/Hdhfbmbkhuk83yhsjdsbfmnb--sdLLlksdjsdjkfjkfdsjljdl')
def minmon():
    arr = get_data()
    arr["data"] = format_data(arr["data"])
    arr["balance"] = format_data(arr["balance"])
    date = ".".join(reversed(arr["date"][0].split("-")[1:]))
    return render_template("min.html", data=arr["data"], date=date, balance=arr["balance"])


@app.route('/gdjfovbnmHgd-HCTpvdbute-sjnnn628awfgfsa')
def maxmon():
    arr = get_data(view="v_by_bud_html_all", fetch_all=True)
    arr["data"] = format_data(arr["data"], False)
    arr["balance"] = format_data(arr["balance"], False)
    date = ".".join(reversed(arr["date"][0].split("-")[1:]))
    return render_template("max.html", data=arr["data"], date=date, balance=arr["balance"])

@app.route('/ebNoa5-zvbj0qHjdv-HVCFjk-5qzkKvd')
def navigate():
    return render_template('nav.html')
    
app.run(port="8080", host="0.0.0.0")
