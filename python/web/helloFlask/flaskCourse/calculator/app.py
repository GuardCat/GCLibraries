from flask import Flask, abort
app = Flask(__name__)

@app.route("/<int:a><any('+', ':', '**', '-', '*'):operator><int:b>/")
def calc(a, operator, b):
	operations = ('+', ':', '**', '-', '*')
	functions = {
		'+': lambda a, b: a + b,
		':': lambda a, b: a / b,
		'**': lambda a, b: a ** b,
		'-': lambda a, b: a - b,
		'*': lambda a, b: a * b
	}

	#if (not operator) or (not operator in operations):
	#	abort(404)

	return str(functions[operator](a, b))

if __name__ == '__main__':
	app.run(host='127.0.0.1', port='8090')