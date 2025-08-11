def tribon(n):
    f = [1, 1, 1]
    
    for i in range(n // 3):
        f[0] = sum(f)
        f[1] = sum(f)
        f[2] = sum(f)
        print(f)
    return(f[n % 3 - 1])

print(tribon(1))