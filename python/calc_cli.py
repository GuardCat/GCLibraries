from argparse import ArgumentParser as ap

parser = ap("Калькулятор в польской нотации")

parser.add_argument("a", type=float, help="Первое число")
parser.add_argument("b", type=float, help="Второе число")
parser.add_argument("o", choices=["+", "-" , "*", ":"], help="Операция, одна из списка")

args = parser.parse_args()

o = {
    "*": lambda a, b: a * b,
    "-": lambda a, b: a - b,
    ":": lambda a, b: a / b,
    "+": lambda a, b: a + b
}

if args.o == ":" and args.b == 0:
    print("Ошибка: деление на 0")
    exit(1)

print(o[args.o](args.a, args.b))
