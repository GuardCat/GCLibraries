x, y = list(input())
x = ord(x) - 97
y = int(y) - 1
sum_q = x + y
board = [["."] * 8 for _ in range(8)]

for i in range(8):
    for j in range(8):
        sum_t = i + j

        if (
            i == y or j == x
            or sum_q == sum_t
            or i - y + x - j == 0
        ):
            board[i][j] = "*"
board[y][x] = "Q"
board.reverse()
for b in board:
    print(*b)
