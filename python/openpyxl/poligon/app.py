from openpyxl import Workbook, load_workbook
from openpyxl.utils import range_boundaries

wb = load_workbook("test.xlsx")
ws = wb.active

dim = ws.calculate_dimension()
print(dim)
min_col, min_row, max_col, max_row = range_boundaries(dim)

