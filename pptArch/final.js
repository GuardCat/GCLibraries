const
	fs = require("fs"),
	{exec} = require("child_process")
;

let list, arr;

exec(`mogrify -colors 256 ./low/*`);
exec(`mogrify -colors 512 *.png *.jpg *.jpeg`);
exec(`mv ./low/* ./`);
exec(`mv ./high/* ./`);
setTimeout(final, 1000);


function final( ) {
	exec ("optipng *.png");
	exec ("jpegoptim *.jpg *.jpeg");
}
