n = int(input())
matrix = [ ]
for i in range(n):
   matrix.append([int(j) for j in input().split()])

for i in range(n):
    for j in range(n):
        print(i, j, matrix[i][j])
        if matrix[i][j] != matrix[n - j - 1][n - i - 1]:
            print("NO")
            exit(0)
print("YES")