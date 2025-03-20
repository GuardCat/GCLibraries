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


def print_mx(mx):
    for row in mx:
        print(*[str(i).ljust(3) for i in row], sep=" ")

def main():
    mx1 = [
        [1, 0],
        [4, 1]
    ]

    mx2 = [
        [1, 0],
        [4, 1]
    ]

    print_mx(pow_mx(mx1, 25))

if __name__ == "__main__":
    main()