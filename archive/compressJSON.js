const tinyJSON = {
	compress: (arr) => {
		const keys = Object.keys(arr[0]);
		return arr.reduce( (result, item) => {
			keys.forEach( (key) => {
				if (!result[key]) result[key] = [ ];
				result[key].push(item[key]);
			});
			return result;
		}, { });
	},

	deflate: (obj) => {
		const
			keys = Object.keys(obj),
			mainKey = keys.reduce( (res, key) => obj[key].length > res.len ? {key: key, len: obj[key].length} : res, {len: 0} ).key
		;
		return obj[mainKey].map( (item, i) => keys.reduce((res, key) => { res[key] = obj[key][i]; return res }, { }) );
	}
};

