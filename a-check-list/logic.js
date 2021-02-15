/* jshint esversion: 6  */
class Checklist {
	constructor (checkboxes, container, excludeClass) {
		this.checkboxes = [...checkboxes];
		this.excludeClass = excludeClass;

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

	get hiddenInputsLen( ) {
		return document.body.querySelectorAll("input:not([type='checkbox'])").length + document.body.querySelectorAll(`${this.excludeClass} input[type='checkbox']`).length;
	}

	get len( ) {
		return this.checkboxes.length - this.hiddenInputsLen;
	}
	get checked( ) {
		return this.checkboxes.filter( box => box.checked);
	}

	get checkedBoxes( ) {
		return this.checkboxes.filter( box => box.checked && box.type === "checkbox");
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
	constructor(el) {
		this.ids = el.getAttribute("data-on").split(";");
		this.influencers = this.ids.map( (id) => document.getElementById(id) );
		this.element = el;

		this.renewStatus( );
	}

	renewStatus( ) {
		this.show = this.show;
	}

	get show( ) {
		return this.influencers.every(el => el.checked);
	}

	set show(isShowed) {

		if (isShowed) {
			this.element.classList.remove("off");
		} else {
			this.element.classList.add("off");
			[...this.element.querySelectorAll("input")].forEach(el => el.checked = false);
		}
	}

}

function director( ) {
	const
		influensers = [...document.querySelectorAll("*[data-on]")],
		tieClasses = influensers.map( el => new TieChecker(el) ),
		dealTerms = document.querySelector(".dealTerms"),
		termsCount = dealTerms.querySelectorAll("table").length,
		main = document.body.querySelector("main"),
		hidingSections = [...main.querySelectorAll("section[id]")], /* Считаем, что все section с id нуждаются в скрытии при отсутствии элементов*/
		checklist = new Checklist( document.body.querySelectorAll("input"), document.body, ".off" ),
		panel = document.querySelector(".panel"),
		counter = panel.querySelector(".counter"),
		reset = panel.querySelector("button.clearIt")
	;

	document.body.addEventListener("change", e => {
		if (e.target.tagName !== "INPUT") return true;
		tieClasses.forEach( t => t.renewStatus( ) );
		hidingSections.forEach( el => hideIfEmpty(el) );
		showIfTermsDone(termsCount, dealTerms.querySelectorAll("input:checked").length, main);
		renewCounter(counter, checklist);
	}, false);

	reset.addEventListener( "click", ( ) => {
		checklist.reset( );
		checklist.save( );
		showIfTermsDone(termsCount, dealTerms.querySelectorAll("input:checked").length, main);
		tieClasses.forEach( t => t.renewStatus( ) );
		renewCounter(counter, checklist);
	});

	tieClasses.forEach( t => t.renewStatus( ) );
	showIfTermsDone(termsCount, dealTerms.querySelectorAll("input:checked").length, main);
	renewCounter(counter, checklist);
}

function showIfTermsDone(termsLen, checkedLen, questionary) {
	if (termsLen === checkedLen) {
		questionary.classList.remove("off");
	} else {
		questionary.classList.add("off");
	}
}

function hideIfEmpty(el) {
	const inputsCount = el.querySelectorAll("li:not(.off)").length;
	if (!inputsCount) {
		el.classList.add("off");
	} else {
		el.classList.remove("off");
	}
}

function renewCounter(counter, checklist) {
	counter.innerHTML = `Проверено: ${checklist.checkedBoxes.length} из ${checklist.len}`;
	if (checklist.len && checklist.checkedNums.length === checklist.len) {
		counter.classList.add("done");
	} else {
		counter.classList.remove("done");
	}
}

window.addEventListener("load", director);
