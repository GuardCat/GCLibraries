/*jshint esversion: 8, browser: true*/


async function director( ) {
	const 
		okveds = await getJson("okved.json"),
		areas =  await getJson("area.json"),
		main = document.body.querySelector("main")
	;
	
	addRow(okveds[2], areas[2], main);
}

async function getJson(url) {
	if (!url) throw new Error(`getJson: recieved empty url`);
	
	return new Promise( async (resolve, reject) => {
		let responce = await fetch(url);
		if (!responce.ok) throw new Error(`getJson: Can't recieve the file "${url}". Server response status: ${responce.status}: ${responce.statusText}`);
		resolve( await responce.json( ) );
	} );
}

function addRow(okvedEntry, areaEntry, block) {
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

window.addEventListener("load", director, false);
