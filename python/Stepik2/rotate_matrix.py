n = int(input())
matrix = [input().split() for _ in range(n)]
matrix.reverse()

for i in range(n):
    for j in range(len(matrix[0])):
        print(matrix[j][i], end=" ")
    print()