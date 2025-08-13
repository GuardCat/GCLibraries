i = 'a a a a a a a aa a a a a a aa a a! b b2 b4 b3 a4 a9 a1 a a!'
counter = {}
result = ""

for i in i.split(' '):
    counter.setdefault(i, 0)
    result += f' {i}{"_" + str(counter[i]) if counter.setdefault(i, 0) else ""}'
    counter[i] += 1

print(result.strip())
