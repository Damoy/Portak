// https://en.wikipedia.org/wiki/A*_search_algorithm
var nodeMap = null;

var NodeContext = {
	buildNodeMap : function(map){
		nodeMap = [];
		for(let row = 0; row < map.getNumRows(); ++row){
			for(let col = 0; col < map.getNumCols(); ++col){
				nodeMap[row * map.getNumCols() + col] = NodeContext.buildNode(map.getTileAt(row, col));
			}
		}
	},

	buildNode(tile){
		return new Node(tile, tile.getMap());
	},

	getNodeMap(){
		return nodeMap;
	},

	getNodeFromTile(tile){
		if(nodeMap == null)
			throw "Illegal NodeContext state.";

		for(let i = 0; i < nodeMap.length; ++i){
			if(nodeMap[i].tile == tile){
				return nodeMap[i];
			}
		}

		throw "Tile should have a node.";
	},
};


class Node{
	constructor(tile, map){
		this.tile = tile;
		this.cameFrom = null;
		this.gScore = 1000000000; // 'infinity'
		this.fScore = 1000000000;
		this.tileId = tile.getId();
		this.map = map;
	}

	equals(other){
		if(other == null)
			return false;

		let te = other.tile.getX() == this.tile.getX()
					&& other.tile.getY() == this.tile.getY()
					&& this.tileId == other.tileId;

		let cfe = (this.cameFrom == null) ? other.cameFrom == null : (this.cameFrom.equals(other.cameFrom));
		let se = this.gScore == other.gScore && this.fScore == other.fScore
		let me = this.map == other.map;

		return te && cfe && se && me;
	}

	neighbor(){
		if(this.isBlocked()){
			println(this + " is blocked.");
			return null;
		}

		var neighbor = [];
		let nm = NodeContext.getNodeMap();
		let current = null;
		let ptr = 0;

		for(let i = 0; i < nm.length; ++i){
			current = nm[i];
			if(this != current && !this.equals(current) && this.isNeighbor(current)){
				neighbor[ptr++] = current;
			}
		}

		return neighbor;
	}

	isNeighbor(node){
		if(node.isBlocked()){
			return false;
		}

		let tr = this.tile.getRow();
		let tc = this.tile.getCol();
		let ntr = node.tile.getRow();
		let ntc = node.tile.getCol();

		let neighborRow = tr == ntr - 1 || tr == ntr + 1;
		let neighborCol = tc == ntc - 1 || tc == ntc + 1;

		if(neighborRow && neighborCol){
			return false;
		}

		if(neighborRow){
			return ntc == tc;
		}

		if(neighborCol){
			return ntr == tr;
		}

		// println("neighborRow: " + neighborRow + ", neighborCol: " + neighborCol
		// 			+ ", tr: " + tr + ", tc: " + tc + ", ntr " + ntr + ", ntc: " + ntc);

		return false;
	}

	isBlocked(){
		return this.tile.isOccupied();
	}

	static lowestFScore(nodes){
		let min = 1000000001;
		var lowestNode = null;

		nodes.forEach((node) =>{
			if(node.fScore < min){
				min = node.fScore;
				lowestNode = node;
			}
		});

		return lowestNode;
	}

	// TODO, see if can work
	static dist_between(node1, node2){
		return Node.heuristic_cost_estimate(node1, node2);
	}

	// TODO see if works
	static reconstruct_path(node1, node2){
		var currentNode = node1.cameFrom;
		var path = [];

		if(currentNode == null){
			println("reconstruct_path saw null node.");
			return null;
		}

		while(currentNode != node2){
			currentNode = currentNode.cameFrom;
			path.push(currentNode);
		}

		if(path.length == 0)
			println("reconstruct_path returned empty path.");
		return path;
	}

	static heuristic_cost_estimate(startNode, endNode){
		let map = startNode.map;

		if(endNode.map != startNode.map)
			throw "Could not execute path finding algorithm.";
	
		let stile = startNode.tile;
		let etile = endNode.tile;
	
		let str = stile.getRow();
		let stc = stile.getCol();
		let etr = etile.getRow();
		let etc = etile.getCol();
	
		// let the col be the x and the row be the y
		let x = (etc - stc) * (etc - stc);
		let y = (etr - str) * (etr - str);
	
		return Math.sqrt(x + y);
	}
}

function AStar(map, tileStart, tileGoal){
	NodeContext.buildNodeMap(map);

	let start = NodeContext.getNodeFromTile(tileStart);
	let goal = NodeContext.getNodeFromTile(tileGoal);

	// arrays of nodes
	let closedSet = [];
	let openedSet = [];

	openedSet.push(start);

	start.gScore = 0; 
	start.fScore = Node.heuristic_cost_estimate(start, goal);

	let loopCounter = 0;
	while(openedSet.length > 0){
		// println(++loopCounter + " loop.");

		let current = Node.lowestFScore(openedSet);
		if(current.equals(goal)){
			return Node.reconstruct_path(start, current);
		}

		removeFromArray(openedSet, current);
		closedSet.push(current);

		let currentNeighbors = current.neighbor();

		for(let i = 0; i < currentNeighbors.length; ++i){
			let neighbor = currentNeighbors[i];

			if(closedSet.includes(neighbor)){
				continue;
			}

			if(!openedSet.includes(neighbor)){
				openedSet.push(neighbor);
			}

			let tentativeGScore = current.gScore + Node.dist_between(current, neighbor);
			if(tentativeGScore >= neighbor.gScore){
				continue;
			}

			neighbor.cameFrom = current;
			neighbor.gScore = tentativeGScore;
			neighbor.fScore = neighbor.gScore + Node.heuristic_cost_estimate(neighbor, goal);
		}
	}

	println("Returned null at end of A*.");
	return null;
}

