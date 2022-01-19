
class Validator {
	constructor({input, regs, minLen = 0, maxLen = +Infinity, startValue, buttons = []}) {
		this.input = input;
		this.regs = regs;
		this.minLen = minLen;
		this.maxLen = maxLen;
		this.oldValue = startValue;
		this.buttons = buttons;
		if (startValue) input.value = startValue;
		this.setState( );

		input.addEventListener("keyup", this.validateLastSym.bind(this), false);
		input.addEventListener("blur", this.setClass.bind(this), false);
		input.addEventListener("change", this.setClass.bind(this), false);
	}

	validateLastSym( ) {
		if ( this.regs.some( reg => reg.test(this.input.value) ) ) {
			this.oldValue = this.input.value;
			this.input.classList.contains("wrong") ? this.setClass( ) :	this.setState( );
			return true;
		}
		this.input.value = this.oldValue;
		this.setState( );
		return false;
	}

	setClass( ) {
		const changed = this.setState( ) === this.input.classList.contains("wrong");
		if(this._good) { 
			this.input.classList.remove("wrong")
		} else {
			this.input.classList.add("wrong");
		}
		if (changed) document.dispatchEvent( new CustomEvent("stateChanged") );
		return this._good;
	}

	setState( ) {
		const state = ( this.regs[0].test(this.input.value) && this.input.value.length >= this.minLen && this.input.value.length <= this.maxLen );
		this._good = state;
		return state;
	}

	get good( ) {
		if (this._good) localStorage.setItem(this.input.id, this.input.value)
		return this._good
	}

}

function direktor( ) {
	const 
		go = document.querySelector("#go"),
		login = document.querySelector("#login"),
		tt = document.querySelector("#tt"),
		copyButton = document.querySelector("#copy"),
		buttons = [copyButton, go],
		ttRegs = [/^\d{12,20}$/, /^\d+$/],
		loginRegs = [ 
			/^W\d+N{0,1}\d+$/i,
			/^W\d+N$/i,
			/^W\d+$/i,
			/^W\d{0,}$/i
		],
		indicators = [
			new Validator( {input: login, regs: loginRegs, minLen: 4, maxLen: 12, startValue: localStorage.getItem("login")} ),
			new Validator( {input: tt, regs: ttRegs, startValue: localStorage.getItem("tt")} )
		]
	;
		
	login.addEventListener("keyup", raiseLetters, false);

	document.addEventListener("stateChanged", ( ) => setButtonsState( indicators.every(i => i.good), buttons ), false);

	go.addEventListener("click", ( ) => {
		const state = indicators.every(i => i.good);
		setButtonsState(state, buttons);
		if (state) openLink(login, tt);
	}, false);

	copyButton.addEventListener("click", ( ) => {
		const state = indicators.every(i => i.good);
		setButtonsState(state, buttons);
		if (state) copyLink(login, tt);
	}, false);

}

function setButtonsState(state, buttons) {
	buttons.forEach( b => {
		if (state) { 
			b.removeAttribute("disabled");
		} else {
			b.setAttribute("disabled", ""); 
		}
	} )
}

function raiseLetters(e) {
	e.target.value = e.target.value.toUpperCase( );
}

function openLink(login, tt) {
	saveToLS(login, tt);
	document.location.href = generateLink(login, tt);
}


function copyLink(login, tt) {
	const url = generateLink(login, tt);
	navigator.clipboard.writeText(url).then( ( ) => alert(`Ссылка скопирована:\n${url}`) );
}

function generateLink(login, tt) {
	return `https://cash.otpbank.ru/?utm_source=MMO&utm_medium=${tt.value}&utm_campaign=${login.value}`;
}

function saveToLS(login, tt) {
	localStorage.setItem("tt", tt.value);
	localStorage.setItem("login", login.value);
}

direktor( );
