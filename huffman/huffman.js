/*jshint es5: true, esnext: true, browser: true*/
const huffman = {
	
	compress(text) {
		const
			stat = this.getSymbolsStat(text),
			pyramid = this.makePyramide( this.makeSortedArray(stat) ),
			table = this.makeCodeTable(pyramid)
		;
		return {table, pyramid};
	},
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

	/**
	 * @desc создает отсортированный массив символов из частотной таблицы
	 * @param {object} частотный хэш-массив
	 * @return {array} массив символов, отсортированный по частоте появления
	 */
	makeSortedArray(obj) {
		const symbols = Object.keys(obj);
		symbols.sort( (a,b) => {
			if (obj[a] < obj[b]) return 1;
			if (obj[a] > obj[b]) return -1;
			return 0;
		} );
		return symbols;
	},
	
	/**
	 * @desc создает бинарное дерево из отсортированного массива символов
	 */
	makePyramide(arr) {
		while (arr.length > 1) {
			arr.push( arr.splice(-2, 2) );
		}
		return arr.flat( );
	},
	
	makeCodeTable(arr, code = "", result = { }) {
		arr.forEach( (el, i) => {
			if ( !(el instanceof Array) ) {
				result[el] = code + i;
			} else {
				return this.makeCodeTable(el, code + i, result);
			}
		} );
		return result;
	}
	
};
/* todo
+функция, из объекта частот создающая отсортированный массив символов
функция сбора пирамидки
функция создания кодов из пирамидки
функция кодирования текста
функция сбора функций в алгоритм сжатия
функция разбора сжатого текста
функция декодирования текста
функция сбора функция в алгоритм распаковки
*/