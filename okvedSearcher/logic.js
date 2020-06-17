/*jshint esversion: 9, browser: true*/
"use strict";

function oldBrowser( ) {
	try {
		var map = new Map( );
	} catch(e) {
		return true;
	}
	return false;
}

if ( oldBrowser( ) ) locate.href = "oldBrowser.html";

window.addEventListener("load", director, false);

/**
 * @desc director not pure async function. Sets events, loads data.
 * @requires file base.json
 * @requires function getJson
 * @requires function doSearch
 * @requires HTMLElement main — for placing information
 * @requires HTMLElement input[name='mainField'] — for getting keywords
 * @return undefined
*/
async function director( ) {
	let timeId = 0;
	const
		base = await getJson("base.json"),
		main = document.body.querySelector("main"),
		keys = ["code", "name", "desc"],
		input = document.querySelector("input[name='mainField']"),
		search = (e, t = 1000) => {
			clearTimer( );
			if (e.keyCode === 13) {
				search({ }, 10);
				return false;
			}
			timeId = setTimeout(doSearch, t, input, main, base, keys);
		},
		clearTimer = ( ) => {if (timeId) clearTimeout(timeId);}
	;

	input.addEventListener("keyup", search, false);
	input.addEventListener("keydown", clearTimer, false);
	document.forms.mainForm.addEventListener( "submit", (e) => e.preventDefault( ) );
}

/**
 * @desc doSearch not pure function searches areas by keywords and okveds.
 * 		 Adds info in main element.
 * @param  {HTMLElement} input  the text field with keywords
 * @param  {HTMLElement} main there will be placed the result of the searching
 * @param  {array} base base of okveds
 * @param  {array} keys Array of text — keys for okveds.
 * @requiress function grep — for cross-searching
 * @requires functio} addRow — for adding info into the main element
 * @return {undefined}
 */
function doSearch(input, main, base, keys) {
	const words = textToArray(input.value).filter( word => word.length > 1);
	main.innerHTML = "<marquee behavior='alternate' direction='right'>Поиск...</marquee>";
	setTimeout( ( ) => {
		let found = grep(base, keys, words);
		main.innerHTML = "";
		addRow(found, main);
	}, 10);
}

/**
 * @desc getJson pure async function
 * @param  {string} url for loading json file
 * @throws {error} if the server returns an error
 * @return {promise} for accesing to the recieved data
 */
async function getJson(url) {

	return new Promise( async (resolve, reject) => {
		let responce = await fetch(url);
		if (!responce.ok) throw new Error(`getJson: Can't recieve the file "${url}". Server response status: ${responce.status}: ${responce.statusText}`);
		resolve( await responce.json( ) );
	} );
}

/**
 * @desc addRow not pure function adds a row to the main element
 *
 * @param  {object or array of objects} okvedEntry the found row from base
 * @param  {HTMLElement} block — there will be placed result
 * @param  {boolean} descFlag if shoud include the description to the result
 * @return {undefined}
 */
function addRow(okvedEntry, block, descFlag) {
	if (okvedEntry instanceof Array) {
		if (okvedEntry.length > 1) {
			block.insertAdjacentHTML( "beforeend", createO({desc: `Найдено вариантов: ${okvedEntry.length}`,code: "", name: ""}) );
			block.insertAdjacentHTML( "beforeend", createA({area: ""}) );
		}
		return okvedEntry.map( entry => addRow(entry, block) );
	}

	block.insertAdjacentHTML( "beforeend", createO(okvedEntry) );
	block.insertAdjacentHTML( "beforeend", createA(okvedEntry) );
}


/**
 * @desc createA pure function creates HTML by its static template
 *
 * @param  {object} entry that contains key "area"
 * @return {string} with HTML code
 */
function createA(entry) {
	return `<p>${entry.area}</p>`;
}

/**
 * @desc createO pure function creates HTML by its static template
 *
 * @param {object} entry that contains keys "code" and "desc"
 * @param {boolean} descFlag if should to add "desc" to the result
 * @return {string} with HTML code
 */
function createO(entry, descFlag = true) {
	const
		message = `<p><strong>${entry.code} ${entry.name}</strong>`,
		closer = `</p>`,
		desc =	`${entry.desc}`.replace(/\^/gi,"<br>")
	;
	return message + (descFlag ? desc + closer : closer);
}


/**
 * @desc grep pure function searches rows in Array of objects
 * 		 by key words. Every row has to contain one of more those key words.
 * 		 The result sortes, keywords include in the span node with
 * 		 HTML class 'founded'
 *
 * @param  {array} arr base for search
 * @param  {array} keys for search. It is necessery that the keys be in the arr.
 * @param  {array} words keywords for the searching
 * @return {array} the filtered sorted and marked searching result.
 */
function grep(arr, keys, words) {
	if (!words.length) return [{code:"", name: "введите больше слов (латиница и символы не учитываются)", desc: "", area: ""}];
	const allKeys = Object.keys(arr[0]).filter( akey => !keys.some(key => key === akey) ), /*List of the keys which not used in the searching*/
		result = words.reduce(
		(res, word) => {
			return res.filter( el => {
				let r = new RegExp(word, "gi");
				return keys.some( (key) => r.test(el[key]) );
			} );
		}, arr)
		.sort( (a, b) => {
			const
				phrase = new RegExp( words.join(" "), "gi"),
				startPhrase = new RegExp( "^" + words.join(" "), "gi"),
				wholePhrase = new RegExp( "^" + words.join(" ") + "$", "gi")
			;

			for (let keyid in keys) {
				if ( wholePhrase.test(b[ keys[keyid] ]) ) return 0;
				if ( startPhrase.test(a[ keys[keyid] ]) ) return -1;

				if ( startPhrase.test(b[ keys[keyid] ]) ) return 0;
				if ( phrase.test(a[ keys[keyid] ]) ) return -1;

				if ( phrase.test(b[ keys[keyid] ]) ) return 0;
				if ( words.some( (word) => a[ keys[keyid] ].search(word) !== -1 ) ) return -1;
			}
			return 0;
		} )
		.map( element => {
			const mapResult = { };
			keys.forEach( key => {
				words.forEach( word => {
					const r = new RegExp(`(${word})`, "gi");
					let elementForChange = mapResult[key] ? mapResult[key] : element[key];
					mapResult[key] = elementForChange.replace(r, "<span class='found'>$1</span>");
				} );
				allKeys.forEach( akey => mapResult[akey] = element[akey] );
		} );
		return mapResult;
	} );

	if (!result.length) {
		return [{code:"", desc: "Ничего не найдено. Попробуйте сформулировать иначе.", name: "", area: ""}];
	}
	return result;
}

function grepMissedCodes(okveds, areas) {
	return okveds.filter( okved => !areas.some( area => area.code === okved.code ) );
}

function textToArray(text) {
	const
		badSymbols = /[^А-ЯЁ0-9\. ]/gi,
		spaces = / +/g
	;
	return text.replace(badSymbols, "").split(spaces).filter( text => !!text );
}
