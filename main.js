
let editable_config = {
	"enable_trace": true,
	"white_threshold": 200,
	"adjDetail": null, // resize amount; smaller = more pixelated
	"max_iterations": 5000,
	"show_checked_path": false
}

let adjustables = ["adjDetail"];
for(let i = 0; i < adjustables.length; i++) {
	let ipt = document.getElementById(adjustables[i]);
	editable_config[adjustables[i]] = ipt.value;
	ipt.addEventListener("input", () => {
		config[adjustables[i]] = ipt.value;
		handleFiles();
	});
}

let config = {
	"enable_trace": editable_config.enable_trace,
	"white_threshold": editable_config.white_threshold,
	"adjDetail": editable_config.adjDetail,
	"max_iterations": Math.round(editable_config.max_iterations/editable_config.adjDetail),
	"show_checked_path": editable_config.show_checked_path
}

let img;
const inputElement = document.getElementById("imgInput");
inputElement.addEventListener("change", handleFiles, false);
function handleFiles() {
	const files = inputElement.files;
	if(files.length < 1) return;

	const file = files[0];
	if (!file.type.startsWith('image/')) return

	const reader = new FileReader();
	reader.onload = function(e) {
		img = new Image();

		img.onload = function () {
			contour();
		};
		img.src = URL.createObjectURL(file);
	};
	reader.readAsDataURL(file);
}

function contour() {
	const canvas = document.getElementById("output");
	canvas.height = canvas.width * (img.height / img.width);

	let ctx = canvas.getContext("2d");
	ctx.imageSmoothingEnabled = false;
	ctx.clearRect(0, 0, canvas.width, canvas.height);

	/* pixelate */
	// https://stackoverflow.com/questions/19262141/resize-image-with-javascript-canvas-smoothly/19262385
	const amount = config["adjDetail"]; // resize amount; smaller = more pixelated
	const oc = document.createElement('canvas'),
		octx = oc.getContext('2d');
	oc.width = img.width * amount;
	oc.height = img.height * amount;
	octx.drawImage(img, 0, 0, oc.width, oc.height);
	octx.drawImage(oc, 0, 0, oc.width * amount, oc.height * amount);
	/* --------- */

	let imageData = octx.getImageData(0, 0, oc.width, oc.height); // get pixelated image data
	octx.putImageData(squareTrace(imageData), 0, 0); // override old pixelated image data with new image

	ctx.drawImage(oc, 0, 0, oc.width * amount, oc.height * amount, 0, 0, canvas.width, canvas.height);
}

function getStart(imgData) {
	// find first black pixel
	let borderStart = false;
	for(let y = 0; y < imgData.height; y++) {
		for(let x = 0; x < imgData.width; x++) {
			const index = (x + (y * imgData.width)) * 4;
			const r = imgData.data[index], g = imgData.data[index + 1], b = imgData.data[index + 2];
			if(rgb_is_border(r,g,b)) {
				imgData.data[index+0] = 255;
				imgData.data[index+1] = 0;
				imgData.data[index+2] = 0;
				borderStart = [x, y];
				break;
			}
		}
		if(borderStart) break;
	}
	return borderStart;
}

function rgb_is_border(r, g, b) {
	if(r === undefined) return false;
	return ((r <= config.white_threshold && g <= config.white_threshold && b <= config.white_threshold) ? true : false);
}