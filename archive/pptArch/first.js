const
	fs = require("fs"),
	{exec} = require("child_process"),
	minOption = "-25k",
	maxSize = 1365
;

let list, arr;
exec("rm *.svg *.wdp");
exec("identify *.png *.jpg *.jpeg | cut -f 1 -d 'x' > list.txt");

setTimeout(resize, 1000);

function resize( ) {
	list = fs.readFileSync("./list.txt", "utf8");
	arr = list.split("\n");

	arr = arr.filter( e => {
		size = +e.split(/ +/g)[2];
		return size > maxSize;
	} );

	arr.forEach( e => {
		name = e.split(/ +/g)[0];
		exec(`mogrify -resize ${maxSize} ${name}`)
	} );
	
	exec("identify *.png *.jpg *.jpeg | grep -i grayscale | cut -f 1 -d ' ' | xargs -I {} rm {}");
	exec(`find . -iname '*.png' -size ${minOption} -delete`);
	exec(`find . -iname '*.jpg' -size ${minOption} -delete`);
	exec(`find . -iname '*.jpeg' -size ${minOption} -delete`);	

}
