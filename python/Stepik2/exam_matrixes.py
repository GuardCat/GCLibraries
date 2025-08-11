arr =  input().split()
n = int(input())
iteration = 0
res = []


def full_len(arr):
    return sum([len(el) for el in arr])


while full_len(res) < len(arr):
    mid_arr = [ ]
    for i in range(iteration, len(arr), n):
        mid_arr.append(arr[i])
    res.append(mid_arr)
    iteration += 1

print(res)
