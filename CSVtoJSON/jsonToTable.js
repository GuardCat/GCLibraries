function JSONToTable(json) {
	const 
		captions = generateCaptions(json[0]),
		rows = json.reduce( (res, el) => res + generateRow(el), "")
	;
	return "<table><tbody>" + captions + rows + "</tbody></table>";
}

function generateCaptions(obj) {
	const keys = Object.keys(obj);
	return keys.reduce( (res, el) => {
		res += `<th>${el}</th>`;
		return res;
	} ,"<tr>") + "</tr>"
}

function generateRow(obj) {
	const keys = Object.keys(obj);
	return keys.reduce( (res, el) => {
		res += `<td>${obj[el]}</td>`;
		return res;
	} ,"<tr>") + "</tr>"
}
