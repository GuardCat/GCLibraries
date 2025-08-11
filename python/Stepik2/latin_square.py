n = int(input())
matrix = [ ]
for i in range(n):
   matrix.append([int(j) for j in input().split()])


def get_column(arr, c):
    res = []
    for row in arr:
        res.append(row[c])
    return res


for row in matrix:
    for i in range(1, n + 1):
        if not i in row:
            print("NO")
            exit(0)

for c in range(n):
    for i in range(1, n + 1):
        if not i in get_column(matrix, c):
            print("NO")
            exit(0)

print("YES")