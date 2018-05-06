// printing
function println(text){
  console.log(text);
  console.log("\n");
}

// deleting an element from an array
function removeFromArray(array, elt){
	let index = array.indexOf(elt);
	if (index > -1)
    	array.splice(index, 1);
}

function irand(min, max){
	return Math.floor(Math.random() * max) + min;  
}

function gen2DArray(rows) {
	var arr = [];

	for (let i = 0; i < rows; i++) {
		arr[i] = [];
	}

	return arr;
}

function computeRadius(value, size){
		return((value % 5) << 1) + (size >> 2);
}

function castToInt(value){
	return value | 0;
}

function filterTextBy(text, regexp){
	return text.replace(regexp, "");
}

// function collides(x, y, w, h, x2, y2, w2, h2){
// 		return !((x > (x2 + w2)) ||
// 		((x + w) < x2) ||
// 		(y > (y2 + h2)) ||
// 		((y + h) < y2));
// }