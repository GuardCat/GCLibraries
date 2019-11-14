/*jshint esversion: 6, browser: true, devel: true*/
( function ( ) {
	const 
		hoursContainer =  document.querySelector("[name='CTRL_26345661']"),
		questions = document.querySelectorAll("div[wtp-part='body'] .wtp-question"),
		groups = [
			[2, 3, 4], [5, 6, 7],
			[8, 9, 10], [11, 12, 13]
		],
		forHide = [1, 14, 15, 16, 17, 18, 19],
		sumControl = [3, 4, 6, 7, 9, 10, 12, 13],
		submitButton = document.querySelector("div[wtp-part='body'] button[wtp-role='submit']"),
		max = 4,
		min = 0
	;

	let allHidedFlag, submitWasDisabled = false;
	window.q = questions;
	
	function getHours( ) {
		return hoursContainer.value === "" ? null : +hoursContainer.value;
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
	
	function configureQuestions( ) {
		if ( getHours( ) > max ) hoursContainer.value = max;
		if ( getHours( ) < min ) hoursContainer.value = min;
		const
			h = getHours( ),
			groupsAmount = h <= groups.length ? h : groups.length
		;
		
		if (groupsAmount) groups.slice(0, groupsAmount).forEach( group => showQuestions(group) );
		if (groupsAmount < groups.length ) groups.slice( -(groups.length - groupsAmount) ).forEach( group => hideQuestions(group) );
		
		if (!h && h!== null) {
			allHidedFlag = true;
			hideQuestions(forHide);
			
			submitWasDisabled = submitButton.hasAttribute("disabled");
			submitButton.removeAttribute("disabled");
			
		} else if (allHidedFlag) {
			allHidedFlag = false;
			showQuestions(forHide);
			if (!submitWasDisabled) submitButton.setAttribute("disabled", "");
		}
	}
	
	hoursContainer.addEventListener("keyup", configureQuestions, false);
	questions[questions.length - 2].addEventListener("click", configureQuestions, false);
	document.querySelector(".ui-spinner").addEventListener("click", configureQuestions, false);

	setTimeout(configureQuestions, 100);
} ) ( );