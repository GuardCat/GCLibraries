def multiply_mx(mx1, mx2):
    if len(mx1[0]) != len(mx2):
        return False
    
    res = []
    wmx1 = len(mx1[0])
    wmx2 = len(mx2[0])
    hmx1 = len(mx1)

    for r1 in range(hmx1):
        row = [ ]
        for c2 in range(wmx2):
            row.append(sum(mx2[c1][c2] * mx1[r1][c1] for c1 in range(wmx1)))
        res.append(row)
        
    return res


def pow_mx(mx1, exp):
    mx2 = mx1

    for i in range(exp - 1):
        mx2 = multiply_mx(mx1, mx2)
    return mx2


def sum_mx(mx1, mx2):
    wmx1 = len(mx1[0])
    wmx2 = len(mx2[0])
    hmx1 = len(mx1)
    hmx2 = len(mx2)

    if wmx1 != wmx2 or hmx1 != hmx2:
        return False
    
    res = []
    
    for r in range(wmx1):
        res.append([mx1[r][c] + mx2[r][c] for c in range(wmx1)])

    return res


def print_mx(mx):
    for row in mx:
        print(*[str(i).ljust(3) for i in row], sep=" ")

def main():
    mx1 = [
        [2, 1],
        [0, -1]
    ]

    mx2 = [
        [1, 2],
        [3, 4]
    ]

    print_mx(sum_mx(mx1, mx2))

if __name__ == "__main__":
    main()