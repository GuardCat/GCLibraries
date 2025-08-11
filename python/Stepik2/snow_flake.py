n = int(input())
x = n // 2 
y = x

sum_q = x + y
board = [["."] * n for _ in range(n)]

for i in range(n):
    for j in range(n):
        sum_t = i + j

        if (
            i == y or j == x
            or sum_q == sum_t
            or i - y + x - j == 0
        ):
            board[i][j] = "*"

for b in board:
    print(*b)
