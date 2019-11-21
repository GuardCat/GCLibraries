/*jshint es5: true, esnext: true, browser: true*/
const huffman = {
	compress(text) {
		const
			stat = this.__getSymbolsStat(text),
			sortedArray = this.__makeSortedArray(stat),
			pyramid = this.__makePyramide( sortedArray ),
			table = this.__makeCodeTable(pyramid),
			compressedBinText = this.__compressString(table, text),
			compressed = this.__symbolizeBinText(compressedBinText, 50),
			binSymsLength = this.__binStrToSym( sortedArray.length.toString("2") )
		;
		return binSymsLength + sortedArray.join("") + compressed;
	},
	
	/**
	* @desc считает сколько раз каждый символ встречается в тексте
	* @param {string} text
	* @return {object} symbols stat
	*/
	__getSymbolsStat(text) {
		return [ ].reduce.call( text, (res, el) => {
			if ( !(el in res) ) {
				res[el] = 1;
				return res;
			}
			res[el]++;
			return res;
		}, { } ) ;
	},

	/**
	 * @desc создает отсортированный массив символов из частотной таблицы
	 * @param {object} частотный хэш-массив
	 * @return {array} массив символов, отсортированный по частоте появления
	 */
	__makeSortedArray(obj) {
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
	__makePyramide(arr) {
		arr = [...arr];
		while (arr.length > 1) {
			arr.push( arr.splice(-2, 2) );
		}
		return arr.flat( );
	},
	
	/**
	 * @desc создает таблицу Хаффмана
	 */
	__makeCodeTable(arr, code = "", result = { }) {
		arr.forEach( (el, i) => {
			if ( !(el instanceof Array) ) {
				result[el] = code + i;
			} else {
				return this.__makeCodeTable(el, code + i, result);
			}
		} );
		return result;
	},
	
	/**
	 * @desc создает из текста строку 0 и 1 по таблице Хаффмана
	 */
	__compressString(table, text) {
		return [ ].reduce.call( text, (res, el) => {
			return res + table[el];
		}, "" );
	},
	
	/**
	 * @desc строку 0 и 1 переводит в символы группами по 20 символов
	 */
	__symbolizeBinText(text, base) {
		const r = RegExp(`.{1,${base}}`, "g");
		
		return text.match(r).reduce( (res, el) => {
			return res + this.__binStrToSym(el);
		}, "" );
	},
	
	__binStrToSym(binStr) {
		return String.fromCharCode( parseInt(binStr, 2) );
	}
};

/* todo
+функция, из объекта частот создающая отсортированный массив символов
+функция сбора пирамидки
+функция создания кодов из пирамидки
+функция кодирования текста
+функция сбора функций в алгоритм сжатия
функция разбора сжатого текста
функция декодирования текста
функция сбора функция в алгоритм распаковки
*/