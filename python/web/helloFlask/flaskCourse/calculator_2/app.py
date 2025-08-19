from flask import Flask, render_template
app = Flask(__name__)

@app.route('/<float:a>/<string:o>/<float:b>/')
def root(a, o, b):
    functions = {
        '+': lambda a, b: a + b,
        ':': lambda a, b: a / b if b > 0 else "Ошибка",
        '**': lambda a, b: a ** b,
        '-': lambda a, b: a - b,
        '*': lambda a, b: a * b
    }
      
    result = functions.get(o, lambda a, b: "Ошибка")(a, b)
    return render_template('index.html', result=result)

if __name__ == '__main__':
    app.run(port=8090)