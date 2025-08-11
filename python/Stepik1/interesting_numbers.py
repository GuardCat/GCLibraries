def find_taxicab_numbers(limit):
    # Словарь для хранения сумм кубов и соответствующих пар
    cube_sums = {}
    results = []
    
    # Вложенные циклы для проверки всех комбинаций
    for a in range(1, limit):
        for b in range(a, limit):
            # Вычисляем сумму кубов
            sum_of_cubes = a**3 + b**3
            
            # Если эта сумма уже встречалась, нашли интересное число
            if sum_of_cubes in cube_sums:
                pair1 = (a, b)
                pair2 = cube_sums[sum_of_cubes]
                if pair1 != pair2:
                    number = sum_of_cubes
                    if number not in results:
                        results.append(number)
            else:
                # Сохраняем первую пару, которая дает эту сумму
                cube_sums[sum_of_cubes] = (a, b)
    
    return sorted(results)

# Поиск интересных чисел
taxicab_numbers = find_taxicab_numbers(100)

# Вывод первых 5 чисел (включая 1729)
print(taxicab_numbers[:5])
