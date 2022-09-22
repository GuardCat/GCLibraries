class Donkey {
	constructor (name, capacity, term) {
		Object.assign(this, {name, capacity, term});
		this.workCounter = 0;
		this.rate = 5;
	}

	cry( ) {
		console.log( "Eeyore ".repeat(this.term) );
	}

	info( ) {
		console.log(`Donkey-boy ${this.name}, ${this.capacity}`);
	}

	work_hard(amount) {
		if (amount < 0 ) {
			this.term += 2;
			return false;
		}

		this.workCounter += amount;
		this.term -= Math.floor(this.workCounter / this.rate);
		this.workCounter %= 5;
	}
}
