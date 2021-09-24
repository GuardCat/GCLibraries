function colorizeTable(table, tdNumber, styleString) {
	const trArr = [...table.querySelectorAll("tr")];
	let state = 0;
	
	trArr.reduce( (first, second, i) => {
		const 
			firstRowTd = first.querySelector(`td:nth-child(${tdNumber})`),
			secondRowTd = second.querySelector(`td:nth-child(${tdNumber})`),
			theSameFlag = firstRowTd.innerText === secondRowTd.innerText,
			styleIt = theSameFlag ? !!(state % 2) : !!(++state % 2)
		;
		
		second.setAttribute("style", styleIt ? styleString : "");
		
		return second;		
	} );
}

// colorizeTable(someTable, 2, "background-color: #efe")