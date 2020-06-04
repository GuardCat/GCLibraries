/*jshint esversion: 8, browser: true*/


let 
	GCLocalBase,
	main
;

async function director( ) {
	const 
		okveds = await getJson("okved.json"),
		areas =  await getJson("area.json")
	;
	main = document.body.querySelector("main");
	
	addOkved(okveds[2], main);
}

async function getJson(url) {
	if (!url) throw new Error(`getJson: recieved empty url`);
	
	fetch(url).then( (responce) => {
			if (!responce.ok) throw new Error(`getJson: Can't recieve the file "${url}". Server response status: ${responce.status}: ${responce.statusText}`);
			resolve( responce.json( ) );
	} )	
	
}

function addOkved(entry, block) {
	block.insertAdjacentHTML( "beforeend", createO(entry) );
}

function addArea(entry, block) {
	block.insertAdjacentHTML( "beforeend", createA(entry) );
}


function createO(entry) {
	return `<p>${entry.name}</p>`;
}

function createO(entry) {
	return `
		<p>
			<strong>${entry.code} ${entry.name}</strong>
			${entry.desc}
		</p>
	`.replace(/\^/gi,"<br>");
}

window.addEventListener("load", director, false);
