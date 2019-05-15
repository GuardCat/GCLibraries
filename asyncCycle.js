/*jshint es5: true, esnext: true, loopfunc: true, browser: true, devel: true*/
function asyncForEach (arr, worker, watcher, step = 1) {	
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
					cursor++;
					if (cursor >= max) break;
				}
				setTimeout(cycle, 0);
			}
		}
		cycle( );
	} );
}

function asyncCycle (iterator, watcher, step = 1) {	
	return new Promise ( (resolve, reject) => {
		let result = {}, count = 0;
	
		function cycle( ){
			if (result.done) {
				resolve(result);
			} else {
				for(let i = 0; i < step; i++) {
					count++;
					result = !result.done ? iterator.next() : result;
					if (result.done) break;
				}
				if (watcher) watcher(count);
				setTimeout(cycle, 0);
			}
		}
		cycle( );
	} );
}


/* An example of use */
let a = [1, 2, 3, 4, 5, 6];
function sum(n){
	return n + n;
}
console.log(1);
asyncForEach(a, sum).then(console.log);

function* pusher(arr, n) {
	for (let i = 0; i < n; i++) {
		yield( arr.push(i) );
	}
	return arr;
}

function watcher(n) {
	console.log( (n / 10000 * 100).toFixed(0) );
}

asyncCycle(pusher([], 10000), 5, watcher);
