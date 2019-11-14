/*jshint esversion: 6, browser: true, devel: true*/
( function( ) {

	const
		questions = Object.assign( [ ], document.querySelectorAll(".wtp-question") ).slice(2),
		noTrainingsTxt = "В течение последнего месяца тренинги не проводились",
		anotherTxt = "Другое обучение / тренинг (напишу в комментариях)",
		hideOnStart = [3, 4],
		hideBase = { }
	;

	let i;
	hideBase[noTrainingsTxt] = [ 1, 2, 5, 6 ];

	function director( ) {
		hideOnStart.forEach( el => hide(questions[el]) );
		questions[0].addEventListener("click", configureQuestionare, false);
		hideUnHide( );
	}
	
	function getCheckedText(question) {
		const answers = Object.assign( [ ], question.querySelectorAll(".wt-check-item[wt-state='selected']") );
		return answers.map( q => q.querySelector("td.wt-check-item-text-container").innerHTML );
	}
	
	function getCheckedOptions(question) {
		return Object.assign( [ ], question.querySelectorAll(".wt-check-item[wt-state='selected']") );
	}
	
	function configureQuestionare(e) {
		hideUnHide( );		
	}

	function hide(el, c = "hided") {
		if ( !el.classList.contains(c) ) el.classList.add(c);
	}
	function unHide(el, c = "hided") {
		el.classList.remove(c);
	}

	function hideUnHide( ) {
		const 
			textArr = getCheckedText(questions[0]),
			correction = textArr.some( el => el === noTrainingsTxt ) ? 1 : 0,
			themesAmount = textArr.length - correction,
			checked = getCheckedOptions(questions[0]).slice(0, -(themesAmount))
		;
		let question;

		hideOnStart.forEach( (el, i) => {
			if ( (i + correction) < themesAmount) {
				unHide(questions[el]);
				question = questions[el].querySelector("div[wtp-role='q-text']");
				question.innerHTML = question.innerHTML.slice(0, 15) + textArr[i];
			} else {
				hide(questions[el]);
			}
		} );
		
		if ( textArr.some( i => i === noTrainingsTxt ) ) {
			checked.forEach( el => el.click( ) );
			hideBase[noTrainingsTxt].forEach( i => hide( questions[i] ) );
		} else {
			hideBase[noTrainingsTxt].forEach( i => unHide( questions[i] ) );
		}
		
	}
	
	director( );
} )( );