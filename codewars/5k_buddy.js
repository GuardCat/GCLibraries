// Buddy pairs
// https://www.codewars.com/kata/59ccf051dcc4050f7800008f/javascript
// Done

function buddy(start, limit) {
  let one, two;
  
  for (one = start; one < limit; one++) {
    two = getDividersSum(one) - 1;
    if ( one !== two && two >= start && getDividersSum(two) - 1 === one ) return [one, two]; // The tests are sorted by duration.
  }
  
  return "Nothing";
}

function getDividersSum(num) {
	let result = divider = 1, limit = Math.sqrt(num), isSquare = limit === Math.trunc(limit);
	
	while (++divider <= limit) {
		if ( !(num % divider) ) {
			result += divider; 
			result += num / divider;
		};
    }
        
    return isSquare ? result - limit : result; // If num is a square there is an extra value.
};
