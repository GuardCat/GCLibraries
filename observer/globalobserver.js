/*jshint esversion: 6, browser: true, devel: true */
/* globals EventList */

/**
 * @desc	паттерн «Pub/Sub». глобальный вариант. Один экземпляр для многих
 *			объектов. В экземпляре стоит объединять объекты так, чтобы события
 *			минимально перекрывались, также стоит проверять target при обработке
 *			события.
 * @constructor
 * @param {object} obj наблюдаемый объект. Должен уметь использовать publish.
 * @require {object} EventList class
*/
class Observer {
	constructor(objs) {
		this.list = new EventList( );
	}

	/* устанавливает метод publish наблюдамому объекту (объектам).*/
	set(obj) {
		if (!obj) return false;
		if (obj instanceof Array) obj.forEach( elem => this.set(elem) );
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

/* Тестирование */
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
	
	publish( ) {
		return;
	}
}

const
	vasjka = new Cat("Васька", 12),
	barsik = new Cat("Барсик", 24),
	persik = new Cat("Персик", 6),
	catsObserver = new Observer( )
;

catsObserver.set([vasjka, barsik, persik]);

function itMeowed(e) {
	console.log(`${e.target.name} мяукнул.`);
}

catsObserver.subscribe("meowed", itMeowed);

barsik.meow( );
