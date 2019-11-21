const huffman = {
	/**
	* @desc считает сколько раз каждый символ встречается в тексте
	* @param {string} text
	* @return {object} symbols stat
	*/
	getSymbolsStat(text) {
		return [ ].reduce.call(text, (res, el) => {
			if ( !(el in res) ) {
				res[el] = 1;
				return res;
			}
			res[el]++;
			return res;
		}, { }) ;
	},

	makeSortedArray(obj) {
		const symbols = Object.keys(obj);
		symbols.sort( (a,b) => {
			if (obj[a] > obj[b]) return 1;
			if (obj[a] < obj[b]) return -1;
			return 0;
		} );
		return symbols;
	}
}
/* todo
функция, из объекта частот создающая отсортированный массив символов
функция сбора пирамидки
функция создания кодов из пирамидки
функция кодирования текста
функция сбора функций в алгоритм сжатия
функция разбора сжатого текста
функция декодирования текста
функция сбора функция в алгоритм распаковки
*/