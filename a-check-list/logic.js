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

	get notCheckedBoxes( ) {
		return this.checkboxes.filter( box => !box.checked && box.type === "checkbox");
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
		version = "v1.5.2",
		updatedFact = 1648046693114,
		allowedUpdateDate = 1648046693114,
		updatedLocal = +window.localStorage.getItem("checklist_auto_updated"),
		oldDate = new Date(updatedLocal),
		newDate = new Date(updatedFact),

		depended = [...document.querySelectorAll("*[data-on]")],
		tieClasses = depended.map( el => new TieChecker(el) ),
		dealTerms = document.querySelector(".dealTerms"),
		termsCount = dealTerms.querySelectorAll("table").length,

		main = document.body.querySelector("main"),
		disclaimer = document.body.querySelector("aside"),
		versionElement = document.body.querySelector(".version"),
		hidingSections = [...main.querySelectorAll("section[id]")], /* Считаем, что все section с id нуждаются в скрытии при отсутствии элементов*/
		checklist = new Checklist( document.body.querySelectorAll("input"), document.body, ".off" ),
		monitor = document.querySelector("#notCheckedMonitor"),
		panel = document.querySelector(".panel"),
		counter = panel.querySelector(".counter"),
		reset = panel.querySelector("button.clearIt"),
		updateMessage =
`Приложение обновлено.
Данные старой версии ${ updatedLocal > 0 ? "от " + zeroTo( oldDate.getDate( ) ) + "." + zeroTo( oldDate.getMonth( ) + 1 ) + "." + oldDate.getFullYear( ) : ""} удалены, чек-лист будет очищен.
Изменения:
v1.5.2: уточнены условия проверки на fssp и в реестре залогов.
v1.5.1: полностью обновлены документы и требования к письмам.
v1.4: + детализированы требования РГО. x Исправлены ошибки (остатки ГП)
`,
		renewAll = ( ) => {
			let numOffVidgets, checklistVisible;
			tieClasses.forEach( t => t.renewStatus( ) );
 			numOffVidgets = dealTerms.querySelectorAll("table.off").length; // Количество виджетов, которые неактуальны для сделки, их не учитываем.
			checklistVisible = showIfTermsSet( termsCount - numOffVidgets, dealTerms.querySelectorAll("input:checked").length, main );
			const notCheckedWidgets = Array.from( dealTerms.querySelectorAll("table:not(.off)") ).reduce( (result, element) => { 
				if ( element.querySelector("input:checked") ) return result;
				return `${result} <li>${element.caption.innerText}</li> `;
		  	}, "" );
			showIfTermsSet(1, 1 - +checklistVisible, disclaimer); // Если чек-лист показываем, предупреждение скрываем и наоборот.
			monitor.innerHTML = checklistVisible ? "" : notCheckedWidgets;
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

function showIfTermsSet(termsLen, checkedLen, element) {
	if (termsLen === checkedLen) {
		element.classList.remove("off");
		return true;
	}
	element.classList.add("off");
	return false;
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
