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