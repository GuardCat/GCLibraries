/*jshint esversion: 6, browser: true, devel: true*/
( function ( ) {
	const 
		hoursContainer =  document.querySelector("[name='CTRL_26345661']"),
		questions = document.querySelectorAll("div[wtp-part='body'] .wtp-question"),
		groups = [
			[5, 1, 15], [6, 2, 16],
			[7, 3, 17], [8, 4, 18]
		],
		forHide = [9, 10, 11, 12, 13, 14], 
		max = 4,
		min = 0
	;
	let allHidedFlag = false;
	window.q = questions;
	
	function getHours( ) {
		return +hoursContainer.value;
	}
	
	function generateCaptions(capArr) {
		return capArr.reduce( (res, el, i) => {
			return res += `<div id="caption${i + 1}">${el}</div>`;
		}, "" );
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
		if ( getHours( ) > max ) hoursContainer.value = max;
		if ( getHours( ) < min ) hoursContainer.value = min;
		const
			h = getHours( ),
			groupsAmount = h <= groups.length ? h : groups.length
		;
		
		if (groupsAmount) groups.slice(0, groupsAmount).forEach( group => showQuestions(group) );
		if (groupsAmount < groups.length ) groups.slice( -(groups.length - groupsAmount) ).forEach( group => hideQuestions(group) );
		
		if (!h) {
			allHidedFlag = true;
			hideQuestions(forHide);
		} else if (allHidedFlag) {
			allHidedFlag = false;
			showQuestions(forHide);
		}
		
	
	}
	
	hoursContainer.addEventListener("change", configureQuestions, false);
	document.querySelector(".ui-spinner").addEventListener("click", configureQuestions, false);
	configureQuestions( );
} ) ( );