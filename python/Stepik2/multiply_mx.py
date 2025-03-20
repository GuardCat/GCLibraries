def multiply_mx(mx1, mx2):
    if len(mx1[0]) != len(mx2):
        return False
    res = []

    for r1 in range(len(mx1)):
        row = [ ]
        for c2 in range(len(mx2[0])):
            row.append(sum([mx2[c1][c2] * mx1[r1][c1] for c1 in range(len(mx1[0]))]))
        res.append(row)
        
    return res


def print_mx(mx):
    for row in mx:
        print(*[str(i).ljust(3) for i in row], sep=" ")


mx1 = [
    [1, 0],
    [4, 1]
]

mx2 = [
    [1, 0],
    [4, 1]
]

mx3 = multiply_mx(mx1, mx2)

for i in range(3, 26):
    mx3 = multiply_mx(mx1, mx3)

print_mx(mx3)
"""
mx1 = [
    [2, -3, 1],
    [5, 4, -2]
]

mx2 = [
    [-7, 5],
    [2, -1],
    [4, 3]
]
"""

