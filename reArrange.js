/**
 * @function		reArrange
 * @description	Возвращает массив всех уникальных вариантов перестановок полученной текстовой строки
 * @param txt		строка для генерации перестановок
 * @requires		Function addEachMethod
 * @returns			Array массив строк — уникальных вариантов перестановок
 */
function reArrange(txt) {
	let
		source = txt.split(""),
		middleResult = [source.shift( )],
		result = source.reduce( (res, el) => {
			return addEachMethod(res, el);
		}, middleResult)
	;
	return Object.keys( result.map( el => el.join("") ).reduce( (res, el) => {res[el] = ""; return res} , { } )	); // let's drop doubles
}

/**
 * @function		addEachMethod
 * @description	Добавляет в массив предложенный элемент на каждое возможное место.
 * @param arr		Массив, в который будет добавлен элемент. Массив массивов будет уплощён.
 * @param el		Элемент, который добавляем
 * @returns			Array массив массивов, в которые добавлен переданный элемент всеми возможными способами.
 */
function addEachMethod(arr, el) {
	if (arr[0] instanceof Array) return arr.map( el2 => addEachMethod(el2, el)  ).flat( );
	let temparr, result = [ ];
	
	for (let i = 0; i <= arr.length; i++) {
		temparr = [...arr];
		temparr.splice(i, 0, el);
		result.push(temparr)
	}
	return result;
}