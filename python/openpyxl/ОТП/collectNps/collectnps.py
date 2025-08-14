from openpyxl import Workbook, load_workbook
from openpyxl.utils import range_boundaries
import glob

files = glob.glob("*.xlsx")
if "report.xlsx" in files:
    main_wb = load_workbook('report.xlsx')
    files.remove("report.xlsx")
else:
    main_wb = Workbook()
        
main_ws = main_wb.active
main_ws.cell(1, 1).value = "Сводный отчтёт eNps в разрезе ДО"

do_list = {}

def find_col(row, text):
    c = 1
    for cell in row:
        if cell.value == text:
            return c
        c += 1
    return Null

def normalize(txt):
    txt1 = str(txt).replace('"', '').replace("'", "")
    return txt1

col_num = 0

for f in files:
    col_num += 3
    suitable_q_sum = 0
    wb = load_workbook(f)
    ws = wb["Исходное"]
    minc, minr, maxc, maxr = range_boundaries(ws.calculate_dimension())
    do_col = find_col(list(ws.iter_rows(min_row=1, max_row=1))[0], "ДО")
    tu_col = do_col - 1

    print(f'Обрабатываем: {f}')
    for cells in ws.iter_rows(min_row=2, max_row=maxr, min_col=tu_col, max_col=do_col):
        if cells[1].value is None:
            continue
        do_list.update({normalize(cells[1].value): normalize(cells[0].value)})
        
    do_row_num = 3
    for do in do_list:
        negative_answers = 0
        positive_answers = 0
        staff_num = 0
        do_row_num += 1
        main_ws.cell(row=do_row_num, column=2).value = do
        main_ws.cell(row=do_row_num, column=1).value = do_list[do]
        for row in range(2, maxr + 1):
            cell_val = ws.cell(row=row, column=do_col).value
            if normalize(cell_val) != do:
                continue 
            staff_num += 1
            for col in range(1, maxc + 1):
                cell_val = str(ws.cell(row=row, column=col).value).lower()
                if "не согл" in cell_val:
                    negative_answers += 1
                elif "согл" in cell_val:
                    positive_answers += 1
                    
        main_ws.cell(row=do_row_num, column=col_num).value = negative_answers
        main_ws.cell(row=do_row_num, column=col_num + 1).value = positive_answers
        main_ws.cell(row=do_row_num, column=col_num + 2).value = staff_num
    
    main_ws.cell(row=2, column=col_num).value = f.split(".")[0]
    main_ws.cell(row=3, column=col_num).value = "Нег. ответы"
    main_ws.cell(row=3, column=col_num + 1).value = "Поз. ответы"
    main_ws.cell(row=3, column=col_num + 2).value = "Сотрудников, чел"


main_ws.cell(3, 1).value = "ТУ"
main_ws.cell(3, 2).value = "ДО"
r = 3
for d in do_list:
    r += 1
    main_ws.cell(r, 2).value = d
    main_ws.cell(r, 1).value = do_list[d]

    wb = load_workbook(f)
    ws = wb["Исходное"]
    minc, minr, maxc, maxr = range_boundaries(ws.calculate_dimension())

main_wb.save("report.xlsx")