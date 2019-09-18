const tinyJSON = {
	compress: (arr) => {
		return arr.reduce( (result, item) => {
			for (let key in item) {
				if (!item.hasOwnProperty(key)) continue;
				if (!result[key]) result[key] = [ ];
				result[key].push(item[key]);
			}
			return result
		}, { })
	},

	deflate: (obj) => {
		let result = [ ], entries = Object.keys(obj);

		return obj[ entries[0] ].reduce( (result, key) => {

		}, [ ])
	}
};

const a = [
	{a: 1, b: 2},
	{a: 1, b: 2},
	{a: 1, b: 2}
]

const b = tinyJSON.compress(a);

gc.log( encodeURIComponent(JSON.stringify(a)).length);
gc.dir(b);
gc.info( encodeURIComponent(JSON.stringify(b)).length);

