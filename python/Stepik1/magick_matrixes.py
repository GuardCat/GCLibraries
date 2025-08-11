n = int(input())
matrix = [ ]
for i in range(n):
   matrix.append([int(j) for j in input().split()])

def detect_magic(matrix):
    SUM = sum(matrix[0])
    NUMS = [int(i) for i in list("123456789")]
    FLAT = [el for row in matrix for el in row]
    n = len(matrix)

    for i in NUMS:
        if not FLAT.count(i):
            return False
        
    for row in matrix:
        if sum(row) != SUM:
            return False
    for column in range(n):
        if sum([matrix[row][column] for row in range(n)]) != SUM:
                    return False

    if sum([matrix[row][row] for row in range(n)]) != SUM:
        return False

    if sum([matrix[row][n - row - 1] for row in range(n)]) != SUM:
        return False
        


    return True
    
print("YES" if detect_magic(matrix) else "NO")
