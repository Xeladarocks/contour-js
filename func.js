
function sumArrays(a, b) {
	let c = [];
	for (let i = 0; i < Math.max(a.length, b.length); i++) {
		c.push((a[i] || 0) + (b[i] || 0));
	}
	return c;
}

function arraysEqual(a, b) {
	if (a === b) return true;
	if (a == null || b == null) return false;
	if (a.length !== b.length) return false;
	for (let i = 0; i < a.length; ++i) {
		if (a[i] !== b[i]) return false;
	}
	return true;
}










function updTxtIpt(val, id) {
	document.getElementById(id).innerText = val;
}