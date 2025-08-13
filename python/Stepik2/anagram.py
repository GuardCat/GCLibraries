__doc__ = "YES, если предложения — анаграммы и NO в противном случае."
a = sorted([i for i in input().lower() if i.isalpha()])
b = sorted([i for i in input().lower() if i.isalpha()])
print('YES' if a == b else 'NO')
