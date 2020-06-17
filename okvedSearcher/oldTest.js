function oldBrowser( ) {
	try {
		eval("async function testMe(){}")
	} catch(e) {
		return true;
	}
	return false;
}

if ( oldBrowser( ) ){
	 location.href = "oldBrowser.html";
}
