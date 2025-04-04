x, y = list(input())
x = ord(x) - 97
y = int(y) - 1
board = [["."] * 8 for _ in range(8)]
board[y][x] = "N"

for i in range(8):
    for j in range(8):
        k = (x - j) * (y - i)
        if k == 2 or k == -2:
            board[i][j] = "*"

board.reverse()
for b in board:
    print(*b)
