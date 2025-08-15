from openpyxl import Workbook, load_workbook # type: ignore
from openpyxl.utils import range_boundaries, get_column_letter # type: ignore
import glob

files = glob.glob("*.xlsx")
col_num = 0

if "report.xlsx" in files:
    report_wb = load_workbook('report.xlsx')
    files.remove("report.xlsx")
else:
    report_wb = Workbook()
        
report_ws = report_wb.active
report_ws.cell(1, 1).value = "Сводный отчтёт eNps в разрезе ДО"

do_list = {}

def find_col(row, text):
    c = 1
    for cell in row:
        if cell.value == text:
            return c
        c += 1
    return None

def normalize(txt):
    return str(txt).replace('"', '').replace("'", "")

for f in files:
    col_num += 3
    wb = load_workbook(f)
    ws = wb["Исходное"]
    minc, minr, maxc, maxr = range_boundaries(ws.calculate_dimension())
    do_col = find_col(ws[1][0:], "ДО")
    tu_col = do_col - 1

    print(f'Обрабатываем: {f}')
    for vals in ws.iter_rows(min_row=2, max_row=maxr, min_col=tu_col, max_col=do_col, values_only=True):
        if vals[1] is None:
            continue
        do_list.update({normalize(vals[1]): normalize(vals[0])})
        
    do_row_num = 3
    for do in do_list:
        negative_answers = 0
        positive_answers = 0
        staff_num = 0
        do_row_num += 1
        report_ws.cell(row=do_row_num, column=2).value = do
        report_ws.cell(row=do_row_num, column=1).value = do_list[do]
        for row in ws[1:maxr]:
            cell_val = row[do_col - 1].value
            if normalize(cell_val) != do:
                continue 
            staff_num += 1
            for cell in row:
                cell_val = str(cell.value).lower()
                if "не согл" in cell_val:
                    negative_answers += 1
                elif "согл" in cell_val:
                    positive_answers += 1
                    
        report_ws.cell(row=do_row_num, column=col_num).value = negative_answers
        report_ws.cell(row=do_row_num, column=col_num + 1).value = positive_answers
        report_ws.cell(row=do_row_num, column=col_num + 2).value = staff_num
    
    report_ws.cell(row=2, column=col_num).value = f'Ответы из "{f.split(".")[0]}"'
    report_ws.merge_cells(f'{get_column_letter(col_num)}2:{get_column_letter(col_num + 2)}2')
    report_ws.cell(row=3, column=col_num).value = "Ok"
    report_ws.cell(row=3, column=col_num + 1).value = "Не ok"
    report_ws.cell(row=3, column=col_num + 2).value = "Участников"

report_ws.cell(3, 1).value = "ТУ"
report_ws.cell(3, 2).value = "ДО"

report_wb.save("report.xlsx")