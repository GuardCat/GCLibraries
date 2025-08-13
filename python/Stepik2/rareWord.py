i = 'I bought two books: a new book and an old book. The new book was more expensive than the old book.'

text = ''.join([letter for letter in i.lower() if letter.isalpha() or letter == ' ']).split(' ')
o = {k: text.count(k) for k in text}
m = min(o.values())
words = [word for word in o.keys() if o[word] == m]
print(sorted(words)[0])
