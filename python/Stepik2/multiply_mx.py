def multiply_mx(mx1, mx2):
    if len(mx1[0]) != len(mx2):
        return False
    res = []

    for row in range(len(mx1)):
        r = [mx1[row]]
