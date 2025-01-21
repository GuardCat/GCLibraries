n = int(input())

if not 0 <= n <= 36:
    print("ошибка ввода")
elif (1 <= n <= 10) or (19 <= n <= 28):
    print("красный" if n % 2 else "чёрный")
elif (11 <= n <= 18) or (29 <= n <= 36):
    print("красный" if not (n % 2) else "чёрный")
else:
    print("зеленый")
