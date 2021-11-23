

function squareTrace(imgData) {
	if(!config.enable_trace) return imgData

	let borderStart = getStart(imgData);
	if(!borderStart) return imgData;

	let pointer = {
		position: borderStart,
		direction: 3
	}

	let border_path = [];
	let border_checked_path = [];
	for(let i = 0; i < config.max_iterations; i++) {
		let index = (pointer.position[0] + (pointer.position[1] * imgData.width)) * 4;
		const r = imgData.data[index], g = imgData.data[index + 1], b = imgData.data[index + 2];
		if(rgb_is_border(r,g,b)) {
			border_path.push(pointer.position);
		} else if(config.show_checked_path) {
			border_checked_path.push(pointer.position);
		}
		pointer.direction += ( rgb_is_border(r,g,b) ? -1 : 1 );
		pointer.direction = (pointer.direction >= 1 ? (pointer.direction <= 4 ? pointer.direction : 1) : 4);
		pointer.position = sumArrays(pointer.position, dir_to_move(pointer.direction));

		if(arraysEqual(pointer.position, borderStart)) break;
	}

	for(let i = 0; i < border_path.length; i++) {
		let index = (border_path[i][0] + (border_path[i][1] * imgData.width)) * 4;
		imgData.data[index + 0] = 255;
		imgData.data[index + 1] = 0;
		imgData.data[index + 2] = 0;
	}
	if(config.show_checked_path) {
		for(let i = 0; i < border_checked_path.length; i++) {
			let index = (border_checked_path[i][0] + (border_checked_path[i][1] * imgData.width)) * 4;
			imgData.data[index + 0] = 255;
			imgData.data[index + 1] = 125;
			imgData.data[index + 2] = 0;
		}
	}

	return imgData;
}

function dir_to_move(dir) {
	switch(dir) {
		case 1: return [0, 1]; break;
		case 2: return [1, 0]; break;
		case 3: return [0, -1]; break;
		case 4: return [-1, 0]; break;
	}
}