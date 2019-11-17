class GCInput {
	constructor(el) {
		this.input = el.querySelector(".GCInput__input");
		this.title = el.querySelector(".GCInput__title");
		this.titleText = this.title.innerText;
		this.input.setAttribute("placeholder", this.titleText);

		this.input.addEventListener( "focus", this.showTitle.bind(this), false );
		this.input.addEventListener( "blur", this._showHideTitle.bind(this), false );

		this._showHideTitle( );
	}

	_showHideTitle( ) {
		if (!this.value.length) return this.hideTitle( );
		return this.showTitle( );
	}

	hideTitle( ) {
		this.title.classList.remove("GCInput__title_needed");
	}

	showTitle( ) {
		this.title.classList.add("GCInput__title_needed");
	}

	get value( ) {
		return this.input.value;
	}

	publish( ) {
		return;
	}
}