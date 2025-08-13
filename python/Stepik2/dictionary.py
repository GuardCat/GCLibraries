dic = {}
for i in range(int(input())):
    phrase = input().split(": ")
    dic[phrase[0]] = phrase[1]
print(dic)
for _ in range(int(input())):
    print(dic[input()])
