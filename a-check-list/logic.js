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
		this.ids = el.getAttribute("data-on").split("|").map( text => text.split(";") );
		this.influencers = this.ids.map( arr => arr.map(id => document.getElementById(id) ) );
		this.element = el;

		this.renewStatus( );
	}

	renewStatus( ) {
		this.show = this.show;
	}

	get show( ) {
		return this.influencers.some( arr => arr.every(el => el.checked) );
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
		version = "v1.3",
		updatedFact = 1624452392118,
		allowedUpdateDate = 1624452392118,
		updatedLocal = +window.localStorage.getItem("checklist_auto_updated"),
		oldDate = new Date(updatedLocal),
		newDate = new Date(updatedFact),

		depended = [...document.querySelectorAll("*[data-on]")],
		tieClasses = depended.map( el => new TieChecker(el) ),
		dealTerms = document.querySelector(".dealTerms"),
		termsCount = dealTerms.querySelectorAll("table").length,

		main = document.body.querySelector("main"),
		versionElement = document.body.querySelector(".version"),
		hidingSections = [...main.querySelectorAll("section[id]")], /* Считаем, что все section с id нуждаются в скрытии при отсутствии элементов*/
		checklist = new Checklist( document.body.querySelectorAll("input"), document.body, ".off" ),
		panel = document.querySelector(".panel"),
		counter = panel.querySelector(".counter"),
		reset = panel.querySelector("button.clearIt"),
		updateMessage =
`Приложение обновлено.
Данные старой версии ${ updatedLocal > 0 ? "от " + zeroTo( oldDate.getDate( ) ) + "." + zeroTo( oldDate.getMonth( ) + 1 ) + "." + oldDate.getFullYear( ) : ""} удалены, чек-лист будет очищен.
Изменения:
v1.3: + добавлена ГП и Лада / УАЗ
v1.28.3: + ДЦ «Юрал трейд» в исключения по документам на ПВ
v1.28: ~ теперь не нужно проверять качество скана ЭПТС
`,
		renewAll = ( ) => {
			let numOffVidgets;
			tieClasses.forEach( t => t.renewStatus( ) );
 			numOffVidgets = dealTerms.querySelectorAll("table.off").length;
			showIfTermsSet(termsCount - numOffVidgets, dealTerms.querySelectorAll("input:checked").length, main);
			hidingSections.forEach( el => hideIfEmpty(el) );
			renewCounter(counter, checklist);
		}
	;

	document.body.addEventListener("change", e => {
		if (e.target.tagName !== "INPUT") return true;
		renewAll( );
	}, false);

	reset.addEventListener( "click", e => {
		checklist.reset( );
		checklist.save( );
		renewAll( );
		e.stopPropagation( );
	});

	document.body.addEventListener("click", e => {
			const el = e.target;
			if ( el.getAttribute("data-title") && el.tagName !== "A" ) e.preventDefault( );
	}, false);

	renewAll( );

	// Обновим дату версии
	versionElement.innerHTML = `${version}&nbsp;${zeroTo( newDate.getDate( ) )}.${zeroTo( newDate.getMonth( ) + 1 )}.${newDate.getFullYear( ) - 2000}`;

	// Сбросим флаги, если ЧЛ был обновлён. Таймаут, чтобы успела отобразиться новая версия до alert
	setTimeout( ( ) => {
		if (updatedLocal < allowedUpdateDate) {
			if (checklist.checked.length) alert(updateMessage);
			reset.click( );
			window.localStorage.setItem("checklist_auto_updated", updatedFact);
		}
	}, 100 );
}

function showIfTermsSet(termsLen, checkedLen, questionary) {
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
	if (checklist.checkedBoxes.length && checklist.checkedBoxes.length === checklist.len) {
		counter.classList.add("done");
	} else {
		counter.classList.remove("done");
	}
}

function zeroTo(num, length = 2) {
    let res = "" + num;
    while (length - res.length > 0) res = "0" + res;
    return res;
}

window.addEventListener("load", director);
