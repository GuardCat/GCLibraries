from flask import Flask, render_template
app = Flask(__name__)

@app.route('/<float:a>/<string:o>/<float:b>/')
def root(a, o, b):
      
    return render_template('index.html', a=a, b=b, o=o)

if __name__ == '__main__':
    app.run(port=8090)