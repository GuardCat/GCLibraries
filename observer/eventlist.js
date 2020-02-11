/*jshint esversion: 6 */
/*jshint browser: true */

// EventList v 1.3

class EventList {
	constructor( ) {
		this.list = { };
	}

	add(event, handler) {
		if ( !(event in this.list) ) this.list[event] = [ ];
		if ( !(handler instanceof Function) ) throw new Error("You're trying to add in EventList not Function.");
		this.list[event].push(handler);
		return this.del.bind(this, event, handler);
	}

	del(event, handler) {
		if ( !(event in this.list) || !this.list[event].length ) return false;
		this.list[event].forEach( (el, i) => { if (el === handler) return this.list[event].splice(i, 1); } );
		return false;
	}

	drop(event) {
		if ( !(event in this.list) ) return false;
		return delete this.list[event];
	}

	run(event, e = { }, ...args) {
		if ( !(event in this.list) ) return false;
		e.type = event;
		this.list[event].forEach( (handler) => handler(e, ...args) );
	}

}