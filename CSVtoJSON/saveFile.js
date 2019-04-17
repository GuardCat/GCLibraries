function saveFile(content, settings={name:"untitled.json", type: "text/json", charset: "utf=8"}) {
		let link = document.createElement("a");
		link.style.display="none";
		link.setAttribute("download", settings.name)
		link.setAttribute("href", `data:${settings.type};charset=${settings.charset},${encodeURI(content)}`);
		document.body.appendChild(link);
		link.click();
}