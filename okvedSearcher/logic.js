/*jshint esversion: 8, browser: true*/


async function director( ) {
	const 
		okveds = await getJson("okved.json"),
		areas =  await getJson("area.json"),
		main = document.body.querySelector("main")
	;
	
	addRow(okveds.slice(5, 10), areas, main);
}

async function getJson(url) {
	if (!url) throw new Error(`getJson: recieved empty url`);
	
	return new Promise( async (resolve, reject) => {
		let responce = await fetch(url);
		if (!responce.ok) throw new Error(`getJson: Can't recieve the file "${url}". Server response status: ${responce.status}: ${responce.statusText}`);
		resolve( await responce.json( ) );
	} );
}

function addRow(okvedEntry, areas, block) {
	if (okvedEntry instanceof Array) return okvedEntry.map( entry => addRow(entry, areas, block) );
	
	const areaEntry = areas.filter(el => el.code === okvedEntry.code)[0];
	block.insertAdjacentHTML( "beforeend", createO(okvedEntry) );
	block.insertAdjacentHTML( "beforeend", createA(areaEntry) );
}

function createA(entry) {
	return `<p>${entry.area}</p>`;
}

function createO(entry) {
	return `
		<p>
			<strong>${entry.code} ${entry.name}</strong>
			${entry.desc}
		</p>
	`.replace(/\^/gi,"<br>");
}

function grep(arr, keys, words) {
	return words.reduce( 
		(res, word) => {
			res = res.filter( el => {
				let r = new RegExp(word, "gi");
				
			} );
		}
	, arr);
}

window.addEventListener("load", director, false);
