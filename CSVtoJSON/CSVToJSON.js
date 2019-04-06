function CSVToJSON(csv) {
	let 
		rows = csv.split("\r\n"), 
		captions = rows[0].split(";"),
		result = [], 
		cells, row, key
	;
	

	for (let rowCursor = 1; rowCursor < rows.length; rowCursor++ ) { /* From one because the zero row has captions */
		cells = rows[rowCursor].split(";");
		row = {}
		
		for (let columnCursor = 0; columnCursor < cells.length; columnCursor++) {
			row[captions[columnCursor]] = cells[columnCursor];
		}
		result.push(row)
		
	}
	return result
}