direktor( );

function direktor( ) {
	const 
		go = document.querySelector("#go"),
		login = document.querySelector("#login"),
		tt = document.querySelector("#TT"),
		copyButton = document.querySelector("#copy"),
		ttReg = /\D/g,
		loginRegs = [ 
			/^W\d+N{0,1}\d+$/i,
			/^W\d+N$/i,
			/^W\d+$/i,
			/^W\d{0,}$/i
		],
		minLoginLength = 4,
		minTTLength = 4
	;
	
	tt.value = localStorage.getItem("tt") || "";
	login.value = localStorage.getItem("login") || "";

	login.addEventListener( "keyup", (e) => preventWrongEntering(e, loginRegs), false )
	login.addEventListener( "change", ( ) => checkInput(login, loginRegs[0], minLoginLength), false )
	login.addEventListener("keyup", raiseLetters, false)
	
	tt.addEventListener("keyup", delWrongSym, false)
	tt.addEventListener( "change", ( ) => checkInput(go, loginRegs[0], minLoginLength), false )

	go.addEventListener("click", ( ) => {
		if ( checkInput(login, loginRegs[0], minLoginLength) && checkInput(tt, /^\d+$/, minTTLength) ) openLink(login, tt);
	}, false);

	copyButton.addEventListener("click", ( ) => {
		if ( checkInput(login, loginRegs[0], minLoginLength)  && checkInput(tt, /^\d+$/, minTTLength) )  copyLink(login, tt);
	}, false);

}

function preventWrongEntering(e, regs) {
	const text = e.target.value;
	if ( regs.some( r => r.test(text) ) ) {
		e.target.setAttribute("oldValue", text)
		return true;
	}
	e.target.value = e.target.getAttribute("oldValue");
}

function delWrongSym(e, reg = /\.+/) {
	e.target.value = e.target.value.replace(reg, "");
}

function raiseLetters(e) {
	e.target.value = e.target.value.toUpperCase( );
}

function openLink(login, tt) {
	saveToLS(login, tt);
	document.location.href = generateLink(login, tt);
}

function checkInput(input, reg, min = 0) {
	const text = input.value
	if ( reg.test(text) && text.length >= min) {
		input.classList.remove("wrong")
		return true;
	}
	input.classList.add("wrong");
	return false;
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
