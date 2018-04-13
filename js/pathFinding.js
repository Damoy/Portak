// https://en.wikipedia.org/wiki/A*_search_algorithm
// TODO

class Node{
	constructor(tile, tileId){
		this.tile = tile;
		//this.cameFrom = [];
		// this.gScore = [];
		// this.fScore = [];
		this.cameFrom = null;
		this.gScore = 0;
		this.fScore = -100000;
		this.tileId = tileId;
	}

	static lowestFScore(nodes){

	}

	static dist_between(node1, node2){

	}

	static reconstruct_path(node1, node2){

	}
}

function AStar(tileStart, tileGoal, tileStartId, tileGoalId){
	let start = new Node(tileStart, tileStartId);
	let goal = new Node(tileGoal, tileGoalId);

	// arrays of nodes
	let closedSet = [];
	let openedSet = [];

	// TODO add id in tile ?
	openedSet.push(start);

	start.gScore = 0;
	start.fScore = -100000; // -infinity

	while(openedSet.length > 0){
		let current = Node.lowestFScore(openedSet);
		if(current == goal){
			return reconstruct_path(cameFrom, current)
		}

		removeFromArray(openedSet, current);
		closedSet.push(current);

		let currentNeighbor = current.neighbor();
		currentNeighbor.forEach((neighbor) => {
			if(closedSet.includes(neighbor)){
				continue;
			}

			if(!openedSet.includes(neighbor)){
				openedSet.push(neighbor);
			}
		});

		let tentativeGScore = current.gScore + Node.dist_between(current, neighbor);
		if(tentativeGScore >= neighbor.gScore){
			continue;
		}

		neighbor.cameFrom = current;
		neighbor.gScore = tentativeGScore;
		neighbor.fScore = neighbor.gScore + heuristic_cost_estimate(neighbor, goal);
	}

	return null;
}

