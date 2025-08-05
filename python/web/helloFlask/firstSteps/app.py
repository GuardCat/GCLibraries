from flask import Flask, render_template
import subprocess

print(__name__)
app = Flask(__name__)

@app.route('/')
def home():
    result = subprocess.check_output(['ls', '-la'], universal_newlines=True).splitlines()
    result = [reversed(i.split()) for i in result ]
    return render_template("index.html", result=result)

    
if __name__ == '__main__':
    app.run(debug=True)