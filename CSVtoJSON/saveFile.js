function saveFile(content, {name, type, charset}) {
		let link = document.createElement("a");
		link.style.display="none";
		link.setAttribute("download", name)
		link.setAttribute("href", `data:${type};charset=${charset},${encodeURI(content)}`);

		document.body.appendChild(link);
		link.click();
}