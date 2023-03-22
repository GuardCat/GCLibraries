const 
	lsKey = "valuePairs",
	vField = document.getElementById("valueText"),
	addButton = document.getElementById("addValButton"),
	monitor = document.getElementById("monitor").querySelector("tbody"),
	recalcButton =  document.getElementById("recalc"),
	reset =  document.getElementById("reset"),
	fPairButton = document.getElementById("FirstOfThePair"),
	sPairButton = document.getElementById("SecondOfThePair"),
	recalcGUI =  document.getElementById("recalcGUI"),
	regularGUI =  document.getElementById("regularGUI")
;

async function pairize(arr, fn) {
	arr.forEach( (first, i, arr) => {
		slice = arr.slice(i + 1);
			slice.forEach( async second => {
				await fn(first, second)
				console.log(first);
		});
	} );
}

document.getElementById("enterIt").onsubmit = (e) => {
	e.preventDefault( );
	return false;
}

class Base {
	constructor ( { vField, addButton, monitor, recalcButton, lsKey, pairize, fPairButton, sPairButton, recalcGUI, regularGUI }) {
		this.vField = vField;
		this.addButton = addButton;
		this.monitor = monitor;
		this.recalcButton = recalcButton;
		this.lsKey = lsKey;
		this.pairize = pairize;
		this.sPairButton = sPairButton;
		this.fPairButton = fPairButton;
		this.recalcGUI = recalcGUI;
		this.regularGUI = regularGUI;
		
		this.readBase( );
	
		addButton.addEventListener("click", ( ) => { 
			this.addItem(this.vField.value);
		} );
		vField.addEventListener("keyup", (e) => {
			if ( !(e.keyCode === 13) ) return false;
			this.addItem(this.vField.value);
		} );

		recalcButton.addEventListener( "click", async ( ) => {
			this.regularGUI.classList.add("hidden");
			this.recalcGUI.classList.remove("hidden");
			await this.pairize(this.base, this.recalcSums.bind(this) );
			this.regularGUI.classList.remove("hidden");
			this.recalcGUI.classList.add("hidden");
			this.saveBase( );
		} );

	}

	addItem(desc) {
		this.base.push( {desc, sum: 0} );
		this.vField.value = "";
		this.saveBase( );
	}

	delItem(index = 0) {
		this.base.splice(index, 1);
		this.saveBase( );
	}

	addSum(index = 0) {
		this.base[index].sum += 1
		this.saveBase( );
	}

	resetSums( ) {
		this.base.forEach( field => field.sum = 0 );
		this.saveBase( );
	}

	async recalcSums(first, second) {
		this.sPairButton.value = first.desc;
		this.fPairButton.value = second.desc;
		return new Promise( resolve => {
			this.sPairButton.onclick = ( ) => {
				first.sum += 1
				resolve(true);
			}

			this.fPairButton.onclick = ( ) => {
				second.sum += 1
				resolve(true);
			}
		})
	}

	reloadMonitor( ) {
		let table = "";
		this.base.forEach( (field,i) => {
			table += `<tr>
							<td>${field.desc}</td>
							<td>${field.sum}</td>
							<td><input type='button' onclick='base.delItem(${i})' value="x"></td>
			</tr>`
		});
		this.monitor.innerHTML = table;
	}

	readBase( ) {
		const rawBase = localStorage.getItem(this.lsKey);
		this.base = rawBase ? JSON.parse( rawBase ) : [ ];
		this.reloadMonitor( );
	}

	saveBase( ) {
		localStorage.setItem( this.lsKey, JSON.stringify(this.base) );
		this.reloadMonitor( );
	}
}

let base = new Base( {vField, addButton, monitor, recalcButton, lsKey, pairize, recalcGUI, regularGUI, sPairButton, fPairButton} );