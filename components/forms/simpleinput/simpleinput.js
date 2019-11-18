class GCInput {
	constructor(el) {
		this.input = el.querySelector(".GCInput__input");
		this.title = el.querySelector(".GCInput__title");

		this.input.addEventListener( "focus", this.showTitle.bind(this), false );
		this.input.addEventListener( "blur", this._showHideTitle.bind(this), false );

		this._setPlaceholder( );
		this._showHideTitle( );
	}

	_setPlaceholder( ) {
		this.input.setAttribute("placeholder", this.titleText);
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

	set titleText(text) {
		this.title.innerText = text;
		this._setPlaceholder( );
	}

	get titleText( ) {
		return this.title.innerText;
	}

	publish( ) {
		return;
	}
}