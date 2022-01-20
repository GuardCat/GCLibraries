// Human readable duration format
// https://www.codewars.com/kata/52742f58faf5485cae000b9a/train/javascript

function formatDuration (seconds) {
	let 
		minutes = Math.floor(seconds / 60),
		hours = Math.floor(minutes / 60),
		delimiters = ["", ", ", " and "],
		result = ""
	;
	minutes -= hours * 60;
	seconds -= hours * 3600 + minutes * 60;

	result += hours ? `${hours} hour${hours > 1 ? "s" : ""}` : "";
	result += minutes ? `${result.length ? "," : ""} ${minutes} minute${minutes > 1 ? "s" : ""}` : "";
	result += seconds ? `${result.length ? "," : ""} ${seconds} second${seconds > 1 ? "s" : ""}` : "";
	return result.replace(/\, ([^,]+)$/, " and $1");
}
