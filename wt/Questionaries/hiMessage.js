( function ( ) {
	const 
		title = document.querySelector("div[wtp-part='body'] > div[wtp-role='title']"),
		questions = document.querySelectorAll("div[wtp-part='body'] .wtp-question")
	;

	window.addHiMessage = (msg) => {
		const msgBox = `<div class = "wtp-question" style = "font-size: 17px; color: black; text-align:left">${msg}</div>`;
		title.insertAdjacentHTML("afterend", msgBox)
	}

	window.addMessage = (msg, qNumber) => {
		const msgBox = `<div class = "wtp-poll-title" style = "text-align:left; margin-top: 25px;">${msg}</div>`;
		questions[qNumber].insertAdjacentHTML("beforebegin", msgBox);
	}
	
	window.hideQuestion = (num) => {
		if (num instanceof Array) return num.forEach( (n) => window.hideQuestion(n) );
		num = num === 999 ? questions.length - 1 : num; // Чтобы скрыть последний вопрос, передаём 999
		questions[num].style.display = "none";
	}
	
	window.showQuestion = (num) => {
		if (num instanceof Array) return num.forEach( (n) => window.showQuestion(n) );
		num = num === 999 ? questions.length - 1 : num; 
		questions[num].style.display = "";
	}

} )( );