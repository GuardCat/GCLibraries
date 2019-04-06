// EventList
"use strict";

class EventList {
	constructor( ) {
		this.list = { };
	}

	add(event, handler) {
		if ( !this.has(event) ) this.list[event] = [ ];
		if (!(handler instanceof Function)) throw new Error("You're trying to add to EventList not Function.")
		this.list[event].push(handler);
		return true;
	}
  
	del(event, handler) {
		let pos, has;
		if ( !this.has(event) || !this.list[event].length ) return false;
		
		has = this.list[event].some(
		  (el, i) => {
			pos = i;
			return el === handler;
		  }
		);
		if (!has) return false;
	
		this.list[event].splice(pos, 1);
		return true;  
	}
  
	drop(event) {
		if ( !this.hasEvent(event) ) return false;
		return delete this.list[event];
	}
	  
	run(event, e, ...args) {
		if ( !this.has(event) ) return false;
		e.type = event;
		this.list[event].forEach( (ev) => ev(e, ...args) ); 
	}
	  
	timerun(event, time) {
	  if ( !this.has(event) ) return false;
	  let events = this._paging(this.list[event]);
	  setTimeout( 
		  function step() {
			  let result = events.next();
			  if (result.done) return true;
			  result.value();
			  setTimeout(step, time);
		  },
	  time);
	}
  
	has(event) {
		return event in this.list;
	}
	
	*_paging (arr) {
		for(let el of arr) yield el;
	}
}

class Observer {
	constructor(obj) {
		this.list = new EventList();
		obj.publish = this.publish.bind(this);
	}
	
	subscribe(event, fn) {
		return this.list.add(event, fn);
	}
	
	unsubscribe(event, fn) {
		return fn ? this.list.del(event, fn) : this.list.drop(event);
	}
	
	publish(event, e, ...args) {
		return this.list.run(event, e, ...args) ;
	}
}

/* Тестирование
class Cat {
	constructor(name, age) {
		(this.name = name), (this.age = age);
	}
	meow() {
		console.error("Meeeeooowwww");
		if (this.publish) this.publish("meowed");
	}
	whoayou() {
		console.info(`My name: ${this.name}, my age: ${this.age} moths.`);
	}
}

function itMeowed(e) {
	console.log(`${this.name} мяукнул`);
}

var cat = new Cat("Васька", 3);
var catObserver = new Observer(cat);
catObserver.subscribe("meowed", itMeowed.bind(cat));
cat.meow();
cat.whoayou();*/
