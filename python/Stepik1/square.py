import math
a, b, c = (float(input()) for _ in range(3))
D = b**2 - 4 * a * c

if D < 0:
    print("Нет корней")
elif D == 0:
    print(-(b / (2 * a)))
else:
    x1 = (-b - D**.5) / (2 * a)
    x2 = (-b + D**.5) / (2 * a)
    print(x1 if x1 < x2 else x2)
    print(x2 if x1 < x2 else x1)
