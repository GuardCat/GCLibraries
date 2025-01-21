n1, n2, o = int(input()), int(input()), input()
warn_z = "На ноль делить нельзя!"
warn_op = "Неверная операция"

if o == "/" and n2 == 0:
    print(warn_z)
elif o != "*" and o != "/" and o != "-" and o != "+":
    print(warn_op)
elif o == "/":
    print(int(n1 / n2))
elif o == "+":
    print(int(n1 + n2))
elif o == "-":
    print(int(n1 - n2))
else:
    print(int(n1 * n2))
