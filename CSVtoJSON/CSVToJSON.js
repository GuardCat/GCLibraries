function CSVToJSON(csv) {
	const rows = csv.split("\r\n"), captions = rows[0].split(";");
	let	result = [], cells, row;
	
	for (let rowCursor = 1; rowCursor < rows.length; rowCursor++ ) {
		cells = rows[rowCursor].split(";");
		row = {}
		
		for (let columnCursor = 0; columnCursor < cells.length; columnCursor++) {
			row[captions[columnCursor]] = cells[columnCursor];
		}
		result.push(row);
	}
	return result
}

function JSONToCSV(arr) {
    const 
		colDelimiter = ";", 
		rowDelimiter = ("\r\n"),
		keys = Object.keys(arr[0])
	;
    
    return arr.reduce( (result, item) => {
        return result + rowDelimiter + keys.reduce( (r,i) => {return r + item[i] + colDelimiter}, "" );
    }, keys.join(colDelimiter) );
}
