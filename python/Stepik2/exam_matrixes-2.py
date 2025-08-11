n = int(input())
arr = []
filtered_arr = []
for _ in range(n):
    arr.append([int(i) for i in input().split()])

filtered_arr = [arr[i][j] for i in range(n) for j in range(len(arr[0])) if (i >= j or i <= j) and i >= n - 1 - j]
print(max(filtered_arr) if len(filtered_arr) > 0 else arr[0][0])