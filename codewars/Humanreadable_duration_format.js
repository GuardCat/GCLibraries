// Human readable duration format
// https://www.codewars.com/kata/52742f58faf5485cae000b9a/train/javascript
//Done

function formatDuration (seconds) {
	const periods = [
		{name: "second", val: 1},
		{name: "minute", val: 60},
		{name: "hour", val: 60 * 60},
		{name: "day", val: 60 * 60 * 24},
		{name: "year", val: 60 *60 * 24 * 365}
	];
	if (seconds === 0) return "now";
	let result = periods.reduceRight( (res, period) => {
		if (period.val > seconds) return res;
		const
			periodRes = Math.floor(seconds / period.val),
			name = periodRes > 1 ? period.name + "s" : period.name
		;
		seconds = seconds % period.val;

		if (res.length) res += ", ";
		return res + `${periodRes} ${name}`
	}, "");

	return result.replace(/\, ([^,]+)$/, " and $1");
}