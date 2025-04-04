from flask import Flask, request, render_template
from threading import Timer
import bleach

app = Flask(__name__)
text = ""

@app.route('/aetext')
def index():
    global text
    return render_template("base.html", caption="Ваш текст", main_text=text)


@app.route('/uptext', methods=['POST'])
def get_text():
    global text
    new_text = request.form.get('text', '').strip()
    time = request.form.get('time', '').strip() or 300
    time = int(time)
    text = bleach.clean(new_text, tags=['br','h1', 'h2', 'p'], strip=True)
    text = text.replace('\n', '<br>')
    text = bleach.linkify(text)
    Timer(time, clear).start()
    return "Ok", 200


@app.route('/aetextc')
def clear():
    global text
    text = "=)"
    return "It's clean", 200

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8880)
    


