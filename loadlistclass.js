/*	Класс LoadList контролирует загрузку элементов script, style и запускает
	* handler, когда все загружено успешно.
	*
	* @constructor
	* @param list {Object} объект объектов. Структура:
	*	myscript (id тега для загрузки): {attribute: "src, href и т.д.",	value:	"содержимое тега"}
	*
	* @param handler {Function} будет вызван, когда все объекты загрузятся. При
	* 	отсутствии игнорируется, конструктор просто присвоит значения атрибутов тегам
*/
class LoadList {
	constructor(list, handler) {
		let element, attribute;
		this.length = Object.keys(list).length;
		this.loaded = 0;
		this.handler = handler;

		if (this.handler instanceof Function) { /* если нет корректного handler, не устанавливаем события */
			for(let i in list) {
				if (!list.hasOwnProperty(i)) continue;
				element = document.getElementById(i);
				attribute = list[i].attribute;
				if(!element) throw new Error(`loadList: got wrong id: ${i}`);

				element.addEventListener("load", this.check.bind(this), false); /* bind т.к. вызов по событию от элемента ломает this*/
			}
		}

		for(let i in list) {
			element = document.getElementById(i);
			attribute = list[i].attribute;
			if(!element) throw new Error(`loadList: got wrong id: ${i}`);
			if(!attribute) throw new Error(`loadList: there aren't attribute in given object. Key: ${i}`);
			if( element.hasAttribute(attribute) ) throw new Error(`loadList: the element ${element} id: "${i}" already has the attribute "${attribute}"`);

			element = document.getElementById(i);
			element.setAttribute(list[i].attribute, list[i].value);
		}

	}

	check( ) {
		this.loaded++;
		if (this.loaded === this.length && (this.handler instanceof Function) ) this.handler( );
	}
}