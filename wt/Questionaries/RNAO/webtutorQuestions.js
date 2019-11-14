/*jshint esversion: 6, browser: true, devel: true*/
( function ( ) {
	const 
		questions = document.querySelectorAll("div[wtp-part='body'] .wtp-question"),
		questionItemHideAll = 13,
		groups = [
			[4, 5], [6, 7]
		],
		forHide = [1, 2, 3]
	;
	
	let allHidedFlag = false;
	window.q = questions;
	
	function getChecked(question) {
		return Object.assign( [ ], question.querySelectorAll("div[wt-state='selected']") );
	}
	
	function hideQuestions(arr) {
		arr.forEach( i => { 
			if( !questions[i].classList.contains("hided") ) questions[i].classList.add("hided"); 
		} );
	}
	function showQuestions(arr) {
		arr.forEach( i => {
			if( questions[i].classList.contains("hided") ) questions[i].classList.remove("hided"); 
		} );
	}
	
	function configureQuestions(e) {
		const
			checked = getChecked(questions[0]),
			noTrainings = checked.some( el => el.getAttribute("wt-item") === "13" ),
			checkedTrainingsAmount = noTrainings ? 0 : checked.length
		;
		
		let allHidedFlags = false;
		
		if (checkedTrainingsAmount) groups.slice(0, checkedTrainingsAmount).forEach( group => showQuestions(group) );
		if (checkedTrainingsAmount < groups.length ) groups.slice( -(groups.length - checkedTrainingsAmount) ).forEach( group => hideQuestions(group) );
		
		if (noTrainings) {
			allHidedFlag = true;
			hideQuestions(forHide);
			checked.forEach( el => el.getAttribute("wt-item") !== "13" ? el.click( ) : true );
		} else if (allHidedFlag) {
			allHidedFlag = false;
			showQuestions(forHide);
		}
	}
	
	questions[0].querySelector(".wtp-question-right").addEventListener("click", (e) => setTimeout( configureQuestions.bind(false, e), 10 ), false);
	configureQuestions( );
} ) ( );