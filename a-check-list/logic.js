/*   */
class Checklist {
	constructor (checkboxes, container) {
		this.checkboxes = [...checkboxes];

		container.addEventListener("change", (e) => {
			if (e.target.tagName !== "INPUT") return true;
			this.save( );
		});

		this.read( );
	}

	check(nums) {
		nums.forEach( num => {
			if (this.checkboxes[num]) this.checkboxes[num].checked = true;
		} );
	}

	reset( ) {
		this.checkboxes.forEach( box => box.checked = false );
	}

	save( ) {
		window.localStorage.setItem("checklist_auto", JSON.stringify(this.checkedNums));
		return true;
	}

	read( ) {
		const savedText = window.localStorage.getItem("checklist_auto");
		if (!savedText) return;
		this.reset( );
		this.check( JSON.parse(savedText) );
	}

	get len( ) {
		return this.checkboxes.length;
	}
	get checked( ) {
		return this.checkboxes.filter( box => box.checked );
	}

	get checkedNums( ) {
		let result = [ ];
		this.checkboxes.forEach( (box,i) => {
			if (box.checked) result.push(i);
		});
		return result;
	}
}

class TieChecker {
	constructor(el, container) {
		this.ids = el.getAttribute("data-on").split(";");
		this.elems = this.ids.map( (id) => document.getElementById(id) );
		this.elems.forEach( el => {
			el.addEventListener("change", this.renewStatus, false);
		} );
	}
	
	renewStatus( ) {
	//	alert(this.show)
		this.show = this.show;
	}
	
	get show( ) {
		alert(this.elems);
		return this.elems.every(el => el.checked);
	}
	
	set show(isShowed) {
		if (isShowed) {
			this.classList.remove("off");
		} else {
			this.classList.add("off");
		}
	}
	
}

function director( ) {
	const 
		influensers = [...document.querySelectorAll("*[data-on]")],
		tieClasses = influensers.map( el => new TieChecker(el) )
	;
}


function olddirector( ) {
	const
		checklist = new Checklist( document.querySelectorAll("input[type=checkbox]"), document.body ),
		panel = document.querySelector(".panel"),
		counter = panel.querySelector(".counter"),
		reset = panel.querySelector("input.clearIt")
	;
	reset.addEventListener( "click", ( ) => {
		checklist.reset( );
		checklist.save( );
		renewCounter(counter, checklist);
	});

	renewCounter(counter, checklist);

	document.body.addEventListener("change", (e) => {
		if (e.target.tagName !== "INPUT") return true;
		renewCounter(counter, checklist);
	});
}

function renewCounter(counter, checklist) {
	counter.innerHTML = `Проверено: ${checklist.checkedNums.length} из ${checklist.len}`;
	if (checklist.checkedNums.length === checklist.len) {
		counter.classList.add("done");
	} else {
		counter.classList.remove("done");
	}
}

window.addEventListener("load", director);
