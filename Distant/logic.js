direktor( );

function direktor( ) {
	const 
		go = document.querySelector("#go"),
		login = document.querySelector("#login"),
		tt = document.querySelector("#TT"),
		copyButton = document.querySelector("#copy"),
		loginReg = /^W\d+N{0,1}\d+$/
	;
	
	tt.value = localStorage.getItem("tt") || "";
	login.value = localStorage.getItem("login") || "";

	login.addEventListener("keyup", delWrongSym, false)
	login.addEventListener("keyup", raiseLetters, false)
	tt.addEventListener("keyup", delWrongSym, false)

	go.addEventListener("click", openLink.bind(null, login, tt), false);
	copyButton.addEventListener("click", copyLink.bind(null, login, tt), false);
}

function delWrongSym(e) {
	const reg = new RegExp( e.target.getAttribute("data-reg"), "gi" )
	e.target.value = e.target.value.replace(reg, "");
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
