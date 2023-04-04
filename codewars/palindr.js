function isPalindrome(num) {
	const str = String(num);
	return str === reverse(str);
}

function reverse(num) {
	return String(num).split("").reverse( ).join("");
}

function countSteps(num) {
	let steps = 0;
	while ( !isPalindrome(num) ) {
		steps++;
		num += +( reverse(num) )
	}
	return steps
}