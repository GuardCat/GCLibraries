import random as r

def get_pairs(arr):
    result = [ ]

    for i in range(len(arr)):
        options = set(arr)
        options.remove(arr[i])
        print(result)
        choice = r.choice(list(options - set(result)))
        result.append(choice)
    return result

names = []
n = int(input())
for _ in range(n):
    names.append(input())

result = get_pairs(names)

for i in range(n):
    print(f'{names[i]} - {result[i]}')

