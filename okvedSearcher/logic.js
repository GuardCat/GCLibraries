/*jshint esversion: 9, browser: true*/
"use strict";
async function director( ) {
	let timeId = 0;
	const
		okveds = await getJson("okved.json"),
		areas =  await getJson("area.json"),
		main = document.body.querySelector("main"),
		keys = ["code", "name", "desc"],
		input = document.querySelector("input[name='mainField']"),
		search = (t = 1000) => {
			clearTimer( );
			timeId = setTimeout(doSearch, t, input, okveds, areas, keys, main);
		},
		searchNotEnter = (e) => {
			if (e.keyCode !== 13) search( );
		},
		clearTimer = ( ) => {
			if (timeId) clearTimeout(timeId);
		}
	;

	input.addEventListener("keyup", searchNotEnter, false);
	input.addEventListener("keydown", clearTimer, false);
	document.forms.mainForm.addEventListener( "submit", (e) => {
		e.preventDefault( );
		search(10);
	} );
}

function doSearch(input, okveds, areas, keys, main) {
	const words = textToArray(input.value).filter( word => word.length > 1);
	main.innerHTML = "<p>Поиск...</p>";
	setTimeout( ( ) => {
		let found = grep(okveds, keys, words);
		main.innerHTML = "";
		addRow(found, areas, main);
	}, 10);
}

async function getJson(url) {

	return new Promise( async (resolve, reject) => {
		let responce = await fetch(url);
		if (!responce.ok) throw new Error(`getJson: Can't recieve the file "${url}". Server response status: ${responce.status}: ${responce.statusText}`);
		resolve( await responce.json( ) );
	} );
}

function addRow(okvedEntry, areas, block, descFlag) {
	if (okvedEntry instanceof Array) {
		if (okvedEntry.length > 1) {
			block.insertAdjacentHTML( "beforeend", createO({desc: `Найдено вариантов: ${okvedEntry.length}`,code: "", name: ""}) );
			block.insertAdjacentHTML( "beforeend", createA({area: ""}) );
		}
		return okvedEntry.map( entry => addRow(entry, areas, block) );
	}
	let areaEntry = areas.filter(area => area.code === okvedEntry.code.replace(/<[^>]+>/g, ""))[0]; // При сравнении убираем span — выделение найденного
	if (!areaEntry && okvedEntry.code) return false; //areaEntry = {area: "Нет данных"};
	if (!okvedEntry.code) areaEntry = {area: ""};
	block.insertAdjacentHTML( "beforeend", createO(okvedEntry) );
	block.insertAdjacentHTML( "beforeend", createA(areaEntry) );
}

function createA(entry) {
	return `<p>${entry.area}</p>`;
}

function createO(entry, descFlag = true) {
	const
		message = `<p><strong>${entry.code} ${entry.name}</strong>`,
		closer = `</p>`,
		desc =	`${entry.desc}`.replace(/\^/gi,"<br>")
	;
	return message + (descFlag ? desc + closer : closer);
}

function grep(arr, keys, words) {
	if (!words.length) return [{code:"", name: "введите больше слов (латиница и символы не учитываются)", desc: ""}];
	const result = words.reduce(
		(res, word) => {
			return res.filter( el => {
				let r = new RegExp(word, "gi");
				return keys.some( (key) => r.test(el[key]) );
			} );
		}, arr)
		.sort( (a, b) => {
			const
				phrase = new RegExp( words.join(" "), "gi"),
				startPhrase = new RegExp( "^" + words.join(" "), "gi")
			;
			if ( startPhrase.test(a.code) ) return -1;

			if ( startPhrase.test(b.code) ) return 0;
			if ( phrase.test(a.code) ) return -1;

			if ( phrase.test(b.code) ) return 0;
			if ( phrase.test(a.name)  ) return -1;

			if ( phrase.test(b.name) ) return 0;
			if ( phrase.test(a.desc)  ) return -1;

			if ( phrase.test(b.desc)  ) return 0;
			if ( words.some( (word) => a.name.search(word) !== -1 ) ) return -1;
			return 0;
	} ).map( element => {
		const mapResult = { };
		keys.forEach( key => {
			words.forEach( word => {
				const r = new RegExp(`(${word})`, "gi");
				mapResult[key] = element[key].replace(r, "<span class='found'>$1</span>");
			} );
		} );
		return mapResult;
	} );

	if (!result.length) {
		return [{code:"", desc: "Ничего не найдено. Попробуйте сформулировать иначе.", name: ""}];
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

window.addEventListener("load", director, false);
