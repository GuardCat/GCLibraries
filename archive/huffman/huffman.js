/*jshint esversion: 6 */ /*jshint browser: true */
const huffman = {
	compress(text) {
		const
			stat = this.__getSymbolsStat(text),
			sortedArray = this.__makeSortedArray(stat),
			pyramid = this.__makePyramide(sortedArray),
			table = this.__makeCodeTable(pyramid),
			compressedBinText = this.__compressString(table, text),
			compressed = this.__symbolizeBinText(compressedBinText, 16)
		;
		return String.fromCharCode(sortedArray.length) + sortedArray.join("") + compressed;
	},
	
	decompress(text) {
		const
			arrayLength = text[0].charCodeAt( ),
			sortedArray = [...text.substr(1, arrayLength)],
			pyramid = this.__makePyramide(sortedArray),
			table = this.__makeCodeTable(pyramid),
			binarizedText = this.__binarizeText( text.substr(1 + arrayLength) )
		;
		return this.__decompressBinarizedString(binarizedText, table, sortedArray);
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
	 * @desc создает из текста строку из содержимого таблицы Хаффмана (0 || 1)
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
	
	
	/**
	 * @desc строку 0 и 1 переводит в 1 символ
	 */
	__binStrToSym(binStr) {
		return String.fromCharCode( parseInt(binStr, 2) );
	},
	
	/**
	 * @desc текст переводит в коды в двоичном представлении и сливает в одну строку
	 */
	__binarizeText(text) {
		return [ ].reduce.call( text, (res, el) => {
			return res + el.charCodeAt( ).toString(2);
		}, "");		
	},
	
	/**
	 * @desc превращает строку 0 и 1 в текст на основе массива символов и таблицы Хаффмана
	 */
	__decompressBinarizedString(text, table, array) {
		return array.reduceRight( (res, el) => {
			const r = RegExp(table[el], "g")
			console.log(table.length);
			return res.replace(r, el);
		}, text );
	}
	
};

let 
	t = "Hello my sweet world", //11
	compressed = huffman.compress(t, 8),
	decompressed = huffman.decompress(compressed)
;

console.log(compressed.length);
console.log(decompressed);
