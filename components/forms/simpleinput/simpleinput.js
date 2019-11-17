class GCInput {
	constructor(el) {
		this.input = el.querySelector(".GCInput__input");
		this.title = el.querySelector(".GCInput__title");
		this.titleText = this.title.innerText;
		this.input.setAttribute("placeholder", this.titleText);

		this.input.addEventListener( "focus", this.title.classList.add("GCInput__title_needed"), false );
		this.input.addEventListener("blur", this._showHideTitle, false);
	}
	_showHideTitle( ) {
		if (this.value.length) return this.title.classList.add("GCInput__title_needed");
		this.title.classList.remove("GCInput__title_needed");
	}
	get value( ) {
		return this.input.value;
	}
	publish( ) {
		return;
	}
}