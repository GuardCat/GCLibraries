class Checklist {
	constructor (checkboxes, container) {
		this.checkboxes = [...checkboxes];
		
		container.addEventListener("change", (e) => {
			if (e.target.tagName === "input") return true;
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
		return this.checkboxes.length
	}
	get checked( ) {
		return this.checkboxes.filter( box => box.checked );
	}
	
	get checkedNums( ) {
		let result = [ ];
		this.checkboxes.forEach( (box,i) => {
			if (box.checked) result.push(i)
		});
		return result
	}
}

function director( ) {
	const checklist = new Checklist( document.querySelectorAll("input"), document.body )
	//window.onunload = checklist.save.bind(checklist); //При вызове события, this — источник события, а не экземпляр объекта
	//checklist.read( );
}

window.addEventListener("load", director);