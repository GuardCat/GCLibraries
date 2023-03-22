const 
	lsKey = "valuePairs",
	vField = document.getElementById("valueText"),
	addButton = document.getElementById("addValButton"),
	monitor = document.getElementById("monitor").querySelector("tbody"),
	recalcButton =  document.getElementById("recalc"),
	resetButton =  document.getElementById("reset"),
	fPairButton = document.getElementById("FirstOfThePair"),
	sPairButton = document.getElementById("SecondOfThePair"),
	recalcGUI =  document.getElementById("recalcGUI"),
	regularGUI =  document.getElementById("regularGUI")
;

document.getElementById("enterIt").onsubmit = (e) => {
	e.preventDefault( );
	return false;
}

class Base {
	constructor ( { vField, addButton, monitor, recalcButton, lsKey, fPairButton, sPairButton, recalcGUI, regularGUI, resetButton}) {
		this.vField = vField;
		this.addButton = addButton;
		this.monitor = monitor;
		this.recalcButton = recalcButton;
		this.lsKey = lsKey;
		this.sPairButton = sPairButton;
		this.fPairButton = fPairButton;
		this.recalcGUI = recalcGUI;
		this.regularGUI = regularGUI;
		this.resetButton = resetButton
		
		this.readBase( );
	
		addButton.addEventListener("click", ( ) => { 
			this.addItem(this.vField.value);
		} );
		vField.addEventListener("keyup", (e) => {
			if ( !(e.keyCode === 13) ) return false;
			this.addItem(this.vField.value);
		} );

		resetButton.addEventListener("click", ( ) => this.resetSums( ) );

		recalcButton.addEventListener( "click", ( ) => {
			this.regularGUI.classList.add("hidden");
			this.recalcGUI.classList.remove("hidden");
			this.recalc( this[Symbol.iterator]( ) );
		} );

	}

	recalc(iterator) {
		let position = iterator.next( );
		if (position.done) {
			this.regularGUI.classList.remove("hidden");
			this.recalcGUI.classList.add("hidden");
			this.sort( );
			this.saveBase( );
			return true;
		}

		this.fPairButton.value = this.base[position.value.fpos].desc;
		this.fPairButton.onclick = ( ) => {
			this.addSum(position.value.fpos);
			this.recalc(iterator);
		}

		this.sPairButton.value = this.base[position.value.spos].desc;
		this.sPairButton.onclick = ( ) => {
			this.addSum(position.value.spos);
			this.recalc(iterator);
		}

	}

	addItem(desc) {
		if ( !desc || this.base.some( entry => entry.desc === desc ) ) return false;
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
	reloadMonitor( ) {
		let table = "";
		this.base.forEach( (field,i) => {
			table += `<tr>
							<td>${field.desc}</td>
							<td>${field.sum}</td>
							<td><input type='button' class='deleter' onclick='base.delItem(${i})' value="X"></td>
			</tr>`
		});
		this.monitor.innerHTML = table;
	}

	readBase( ) {
		const rawBase = localStorage.getItem(this.lsKey);
		this.base = rawBase ? JSON.parse( rawBase ) : [ ];
		this.sort( );
		this.reloadMonitor( );
	}

	sort( ) {
		this.base.sort( (a, b) => a.sum < b.sum ? 1 : -1 );
	}

	saveBase( ) {
		localStorage.setItem( this.lsKey, JSON.stringify(this.base) );
		this.reloadMonitor( );
	}

	[Symbol.iterator]( ) {
		let fpos = 0, spos = 0;
		const max = this.base.length - 1;
		return {
			next( ) {
				if (spos < max) {
					spos++;
				} else {
					fpos++;
					if (fpos >= max) return {done: true};
					spos = fpos + 1
				}
				return {done: false, value: {fpos, spos} }
			}
		}
	}

}

let base = new Base( {vField, addButton, monitor, recalcButton, lsKey, recalcGUI, regularGUI, sPairButton, fPairButton, resetButton} );
