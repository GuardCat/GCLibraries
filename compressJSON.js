const tinyJSON = {
	compress: (arr) => {
		return arr.reduce( (result, item) => {
			for (let key in item) {
				if (!item.hasOwnProperty(key)) continue;
				if (!result[key]) result[key] = [ ];
				result[key].push(item[key]);
			}
			return result;
		}, { });
	},

	deflate: (obj) => {
		const
			keys = Object.keys(obj),
			mainKey = keys.reduce( (res, key) => obj[key].length > res.len ? {key: key, len: obj[key].length} : res, {len: 0} ).key
		;
		return obj[mainKey].map( (item, i) => keys.reduce( (res, key) => { res[key] = obj[key][i]; return res }, { }), [ ]);
	}
};

const a = [
	{a: 1, b: 2},
	{a: 1, b: 2},
	{a: 1, b: 2}
]

const b = tinyJSON.compress(a);
gc.log( JSON.stringify(tinyJSON.deflate(b), false, 2) );/*

gc.log( encodeURIComponent(JSON.stringify(a)).length);
gc.dir(b);
gc.info( encodeURIComponent(JSON.stringify(b)).length);*/
