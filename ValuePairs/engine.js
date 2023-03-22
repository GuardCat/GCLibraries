const 
	lsKey = "valuePairs",
	vField = document.getElementById("valueText"),
	addButton = document.getElementById("addValButton"),
	monitor = document.getElementById("monitor").querySelector("tbody"),
	recalcButton =  document.getElementById("recalc"),
	reset =  document.getElementById("reset")
;

document.getElementById("enterIt").onsubmit = (e) => {
	e.preventDefault( );
	return false;
}

class Base {
	constructor ( { vField, addButton, monitor, recalcButton, lsKey }) {
		this.vField = vField;
		this.addButton = addButton;
		this.monitor = monitor;
		this.recalcButton = recalcButton;
		this.lsKey = lsKey;
		
		this.readBase( );
		this.reloadMonitor( );
		
		addButton.addEventListener("click", ( ) => { 
			this.addItem(this.vField.value);
		} );

		vField.addEventListener("keyup", (e) => {
			if ( !(e.keyCode === 13) ) return false;
			this.addItem(this.vField.value);
		} );

	}

	addItem(desc) {
		this.base.push( {desc, sum: 0} );
		this.vField.value = "";
		this.saveBase( );
		this.reloadMonitor( );
	}

	delItem(index = 0) {
		this.base.splice(index, 1);
		this.saveBase( );
		this.reloadMonitor( );
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
	}

	saveBase( ) {
		localStorage.setItem( this.lsKey, JSON.stringify(this.base) );
	}
}

let base = new Base( {vField, addButton, monitor, recalcButton, lsKey} );