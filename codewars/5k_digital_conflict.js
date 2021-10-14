// The Great Digital Conflict
// https://www.codewars.com/kata/605150ba96ff8c000b6e3df8
// Trying

//return the winner's army as string, 'Draw' or 'Peace'
function battleCodes(armyLetters, armyNumbers) {
	"use strict"
    if (!armyLetters || !armyNumbers) return "Peace";

    let 
        lettersArray = armyLetters
			.split("")
			.map( l => l.charCodeAt( ) - 96 ) /*Magic number*/
			.reverse( ),
        numbersArray = armyNumbers.split(""),
		numberOnTheEdge
    ;

    while (lettersArray.length && numbersArray.length) {
        numberOnTheEdge = numbersArray[0];
        numbersArray[0] -= lettersArray[0];
		
		for (let pos = 0; pos < 2 && pos <= lettersArray.length; pos++) {
			lettersArray[pos] -= numberOnTheEdge;
		}
		
		lettersArray = lettersArray.filter(a => a > 0);
		numbersArray = numbersArray.filter(a => a > 0);
		
    }
    
    if (lettersArray.length) return lettersArray
		.map( l => String.fromCharCode(l + 96) )
		.reverse( )
		.join("");
	if (numbersArray.length) return numbersArray.join("");
	return "Draw"
}


