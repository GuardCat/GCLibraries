function asyncForEach (arr, worker, step = 1) {	
	return new Promise ( (resolve, reject) => {
		let 
			max = arr.length,
			result = [ ],
			cursor = 0
		;
		function cycle( ){
			if (cursor >= max) {
				resolve(result);
			} else {
				for(let i = 0; i <= step; i++) {
					result.push( worker(arr[cursor]) );
					cursor++
					if (cursor >= max) break;
				}
				setTimeout(cycle, 0);
			}
		}
		cycle( );
	} )
}

function asyncCycle (iterator, step = 1) {	
	return new Promise ( (resolve, reject) => {
		let result = {};
	
		function cycle( ){
			if (result.done) {
				resolve(result);
			} else {
				for(let i = 0; i < step; i++) {
					result = !result.done ? iterator.next() : result;
					if (result.done) break
//					console.log(result)
				}
				setTimeout(cycle, 0);
			}
		}
		cycle( );
	} )
}


/* An example of use */
let a = [1, 2, 3, 4, 5, 6];
function sum(n){
	return n + n;
}
console.log(1);
asyncForEach(a, sum).then(console.log)

function* pusher(arr, n) {
	for (let i = 0; i < n; i += 2) {
		yield( arr.push(i) );
	}
	return arr
}

asyncCycle(pusher([], 10000), 5).then(console.log, console.log)