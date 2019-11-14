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

	run(event, e = {}, ...args) {
		if ( !(event in this.list) ) return false;
		e.type = event;
		this.list[event].forEach( (handler) => handler(e, ...args) );
	}

}

/**
 * @desc паттерн «Pub/Sub». Для каждого наблюдаемого объекта —
 *		свой экземпляр. Устанавливает метод publish наблюдаемому объекту.
 * @constructor
 * @param {object} obj наблюдаемый объект. Должен уметь использовать publish.
 * @require {object} EventList class
*/
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
		this.name = name;
		this.age = age;
		this.publish = ( ) => false;
	}
	meow( ) {
		console.error("Meeeeooowwww");
		this.publish("meowed", {target: this});
	}
	whoayou( ) {
		console.info(`My name: ${this.name}, my age: ${this.age} months.`);
		this.publish("aged", {target: this});
	}
}

function itMeowed(e) {
	console.log(`${e.target.name} мяукнул`);
}

function itAged(e) {
	console.log(`${e.target.name} спросили о возрасте`);
}
var cat = new Cat("Васька", 3);
var catObserver = new Observer(cat);
var mewUnsubscribe = catObserver.subscribe("meowed", itMeowed);
var ageUnsubscribe = catObserver.subscribe("aged", itAged);
cat.meow( );
cat.whoayou( );

mewUnsubscribe( );
cat.meow( );
*/