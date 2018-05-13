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

document.head = document.head || document.getElementsByTagName('head')[0];

function changeFavicon(src) {
	var link = document.createElement('link'),
	oldLink = document.getElementById('dynamic-favicon');
	
	link.id = 'dynamic-favicon';
	link.rel = 'shortcut icon';
	link.href = src;

	if (oldLink) {
		document.head.removeChild(oldLink);
	}

	document.head.appendChild(link);
}