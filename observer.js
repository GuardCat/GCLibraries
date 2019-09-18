/*jshint esversion: 6 */
/*jshint browser: true */

// EventList v 1.2
"use strict";

class EventList {
	constructor( ) {
		this.list = { };
	}

	add(event, handler) {
		if ( !(event in this.list) ) this.list[event] = [ ];
		if ( !(handler instanceof Function) ) throw new Error("You're trying to add to EventList not Function.");
		this.list[event].push(handler);
		return true;
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
	  
	run(event, e = {}, ...args) {
		if ( !(event in this.list) ) return false;
		e.type = event;
		this.list[event].forEach( (ev) => ev(e, ...args) ); 
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