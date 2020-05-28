/*jshint esversion: 6, browser: true*/

/**
 * @description function bPage calculates pages sequention for manual brushure printing.
 * @param number pNum number of pages 
 * @param string delimiter delimiter for pages
 * @requires function upTo
 * @returns object with four keys: all (all pages), even, odd and fixed (flag), which shows if pNum was increased to divide by 4.
 */
function bPage(pNum, delimiter = ";") {
	const 
		result = {all: [ ], odd: [ ], even: [ ], evenDesc: [ ], fixed: false}
	;
	let i;
	
	if (pNum <= 0) return result;
	pNum = upTo(pNum, 4);
	
	while (pNum) {
		result.all.push(result.all.length + 1, pNum, result.all.length + 2, pNum - 1);
		pNum = pNum - 4;	
	}
	
	
	for (i = 0; i < result.all.length; i = i + 4) {
		result.odd.push( [ result.all[i], result.all[i + 1] ] );
		result.even.push( [ result.all[i + 3], result.all[i + 2] ] );		
	}
	
	return result;
}

function upTo(num, upNum) {
	return (num % upNum) ? num + (upNum - num % upNum) : num;
}