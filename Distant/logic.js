
class Validator {
	constructor({input, regs, startValue}) {
		this.input = input;
		this.regs = regs;
		this.oldValue = startValue;
		if (startValue) input.value = startValue;

		input.addEventListener("keyup", this.validateLastSym.bind(this), false);
	}

	validateLastSym( ) {
		if ( this.regs.some( reg => reg.test(this.input.value) ) || this.input.value === "" ) {
			this.oldValue = this.input.value;
			localStorage.setItem( this.input.id, this.input.value.toUpperCase( ) );
		} else {
			this.input.value = this.oldValue;
		}
	}
}

function direktor( ) {
	const 
		go = document.querySelector("#go"),
		login = document.querySelector("#login"),
		form = document.querySelector("form"),
		tt = document.querySelector("#tt"),
		copyButton = document.querySelector("#copy"),
		buttons = [copyButton, go],
		ttRegs = [/^\d{10,16}$/, /^\d+$/],
		loginRegs = [ 
			/^W\d+N{0,1}\d{0,}$/i,
			/^W\d{0,}$/i
		];
	new Validator( {input: login, regs: loginRegs, startValue: localStorage.getItem("login")} );
	new Validator( {input: tt, regs: ttRegs, startValue: localStorage.getItem("tt")} );
		
	login.addEventListener("change", raiseLetters, false);
	document.addEventListener( "keyup", ( ) => setButtonsState( form.checkValidity( ), buttons ) );
	copyButton.addEventListener("click", ( ) => copyLink(login, tt), false);
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
	if(e.target.validity.valid) e.target.value = e.target.value.toUpperCase( );
}

function copyLink(login, tt) {
	const url = generateLink(login, tt);
	navigator.clipboard.writeText(url).then( ( ) => alert(`Ссылка скопирована:\n${url}`) );
}

function generateLink(login, tt) {
	return `https://cash.otpbank.ru/?utm_source=MMO&${tt.name}=${tt.value}&${login.name}=${login.value}`;
}

direktor( );
