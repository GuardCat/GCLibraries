/*
Функция разбирает значение location.search.
* @return object объект, ключи которого: параметры до знака =,
* а значения — после. 
*/

function getSearchParams( ) {
	let ls = location.search, rows, values, result = { };
	
	ls = ls.slice(0,1) === "?" ? ls.slice(1) : ls;
	if (!ls) return ls;
	
	rows = ls.split("&");

	rows.forEach( (el) => {
		console.log(el)
		values = el.split("=");
		result[ values[0] ] = values[1];
	} );
	
	return result;
}