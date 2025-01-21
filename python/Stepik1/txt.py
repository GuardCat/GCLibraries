a, b, c = int(input()), int(input()), int(input())
txt1, txt2, txt3 = "Равнобедренный", "Равносторонний", "Разносторонний"

if a == b == c:
    print(txt2)
elif a == b or b == c or a ==c:
    print(txt1)
else:
    print(txt3)
