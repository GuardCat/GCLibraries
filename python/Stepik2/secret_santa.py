import random as r

def get_pairs(arr):
    result = [ ]
    
    for i in range(len(arr)):
        options = list(set(arr) - set(result) - set(arr[i]))
        if not len(options):
            options.append(result[-1])
            result[-1] = arr[i]
        choice = r.choice([*options])
        result.append(choice)
    return result

names = []
n = int(input())
for _ in range(n):
    names.append(input())

result = get_pairs(names)

for i in range(n):
    print(f'{names[i]} - {result[i]}')

