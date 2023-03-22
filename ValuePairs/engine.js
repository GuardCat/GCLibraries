const 
	lsKey = "valuePairs",
	vField = document.getElementById("valueText"),
	addButton = document.getElementById("addValButton"),
	monitor = document.getElementById("monitor").querySelector("tbody"),
	recalcButton =  document.getElementById("recalc"),
	reset =  document.getElementById("reset"),
	fPairButton = document.getElementById("FirstOfThePair"),
	sPairButton = document.getElementById("SecondOfThePair")
;

function pairize(arr, fn) {
	arr.forEach( (first, i, arr) => {
		slice = arr.slice(i + 1);
			slice.forEach(second => {
				fn(first, second)
		});
	} );
}

document.getElementById("enterIt").onsubmit = (e) => {
	e.preventDefault( );
	return false;
}

class Base {
	constructor ( { vField, addButton, monitor, recalcButton, lsKey, pairize, fPairButton, sPairButton }) {
		this.vField = vField;
		this.addButton = addButton;
		this.monitor = monitor;
		this.recalcButton = recalcButton;
		this.lsKey = lsKey;
		this.pairize = pairize;
		this.sPairButton = sPairButton;
		this.fPairButton = fPairButton;
		
		this.readBase( );
	
		addButton.addEventListener("click", ( ) => { 
			this.addItem(this.vField.value);
		} );
		vField.addEventListener("keyup", (e) => {
			if ( !(e.keyCode === 13) ) return false;
			this.addItem(this.vField.value);
		} );

		recalcButton.addEventListener("click", ( ) => this.recalcSums);


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
		this.sPairButton.
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

let base = new Base( {vField, addButton, monitor, recalcButton, lsKey, pairize} );