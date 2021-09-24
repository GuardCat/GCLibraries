class GCInputH {
	constructor(el, title = "") {
		if (el instanceof Array) return el.map( input => new GCInputH(input) );

		this._text = title;
		el.insertAdjacentHTML("afterend", this.html);

		this.input = el.querySelector(".GCInput__input");
		this.title = el.querySelector(".GCInput__title");

		this.input.addEventListener( "focus", this.showTitle.bind(this), false );
		this.input.addEventListener( "blur", this._showHideTitle.bind(this), false );

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
		this.title.classList.add("GCInput__filled");
	}

	showTitle( ) {
		this.title.classList.remove("GCInput__filled");
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

	get html( ) {
		return `
		<label class="GCInput__label">
			<div class="GCInput__title"></div>
			<input class="GCInput__input" type="text">
		</label>
		`
	}

	publish( ) {
		return;
	}
}