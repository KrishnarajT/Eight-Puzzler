// class to store puzzleconfigurations
class PC {
	constructor(puz_config, parent, tile_moved, g_score) {
		this.puz_config = puz_config;
		this.parent = parent;
		this.tile_moved = tile_moved;
		this.gscore = g_score;
		this.final_heuristic = 0;
		this.manhatten_heuristic = 0;
		this.hamming_heuristic = 0;
		this.f_score = this.gscore + this.final_heuristic;
	}

	get_puz_config() {
		return this.puz_config;
	}

	get_parent() {
		return this.parent;
	}

	get_tile_moved() {
		return this.tile_moved;
	}

	get_g_score() {
		return this.gscore;
	}

	set_g_score(g_score) {
		this.gscore = g_score;
	}

	set_parent(parent) {
		this.parent = parent;
	}

	get_f_score() {
		return this.f_score;
	}

	set_puz_config(puz_config) {
		this.puz_config = puz_config;
	}

	set_manhattan_heuristic(manhatten_heuristic) {
		this.manhatten_heuristic = manhatten_heuristic;
		this.final_heuristic =
			this.manhatten_heuristic + this.hamming_heuristic;
		this.f_score = this.gscore + this.final_heuristic;
	}

	set_hamming_heuristic(hamming_heuristic) {
		this.hamming_heuristic = hamming_heuristic;
		this.final_heuristic =
			this.manhatten_heuristic + this.hamming_heuristic;
		this.f_score = this.gscore + this.final_heuristic;
	}
}

// Sample puzzle configuration (numbers represent puzzle pieces)
var board_puz_conf = new PC([2, 8, 4, 6, 9, 3, 1, 7, 5], null, null, 0);

// Function to compare puzzle configurations. that are arrays.
function comparePuzzleConfigurations(puz_config1, puz_config2) {
	// check each element of the array, even if one isnt matching, return false.
	for (let i = 0; i < puz_config1.length; i++) {
		if (puz_config1[i] !== puz_config2[i]) {
			return false;
		}
	}
	return true;
}

// Function to create puzzle board
function createPuzzleBoard() {
	// Get puzzle board element
	const puzzleBoard = document.getElementById("puzzle-board");

	// Loop through puzzle configuration
	board_puz_conf.get_puz_config().forEach((number) => {
		if (number === 9) {
			// Create empty grid item
			const gridItem = document.createElement("div");
			gridItem.className =
				"puzzle-item bg-transparent text-4xl rounded-md w-28 h-28 flex items-center justify-center";
			gridItem.id = 9;
			puzzleBoard.appendChild(gridItem);
			return;
		}
		// Create grid item
		const gridItem = document.createElement("div");
		gridItem.className =
			"puzzle-item bg-base-200 text-base-content text-4xl rounded-md w-28 h-28 flex items-center justify-center";
		gridItem.textContent = number;
		gridItem.id = number;
		puzzleBoard.appendChild(gridItem);

		// Add click event listener for each grid item
		gridItem.addEventListener("click", () => moveTile(number));
	});
}

// Call createPuzzleBoard function to create initial puzzle board
createPuzzleBoard();

// Function to update puzzle board
function updatePuzzleBoard() {
	// Get puzzle board element
	const puzzleBoard = document.getElementById("puzzle-board");

	// Clear puzzle board
	puzzleBoard.innerHTML = "";

	// Recreate puzzle board
	createPuzzleBoard();
}

// Function to move tile
function moveTile(number) {
	const tile = document.getElementById(number);

	// change the puzzle configuration
	const index = board_puz_conf.get_puz_config().indexOf(parseInt(number));
	const zeroIndex = board_puz_conf.get_puz_config().indexOf(9);
	let post_move_puz_conf = board_puz_conf.get_puz_config().slice();
	post_move_puz_conf[index] = 9;
	post_move_puz_conf[zeroIndex] = parseInt(number);
	console.log(post_move_puz_conf);
	board_puz_conf.set_puz_config(post_move_puz_conf);
	updatePuzzleBoard();
}

// Function to move tile
function pseudo_moveTile(number, given_puz_conf) {
	// change the puzzle configuration
	const index = given_puz_conf.get_puz_config().indexOf(parseInt(number));
	const zeroIndex = given_puz_conf.get_puz_config().indexOf(9);
	const new_puzzle_config = new PC(
		given_puz_conf.get_puz_config().slice(),
		given_puz_conf,
		number,
		given_puz_conf.get_g_score() + 1
	);
	let new_puz_conf = new_puzzle_config.get_puz_config();
	new_puz_conf[index] = 9;
	new_puz_conf[zeroIndex] = parseInt(number);
	// console.log(
	// 	"Testing moveTile",
	// 	number,
	// 	" new:",
	// 	board_puz_conf,
	// 	"vs old:",
	// 	new_puzzle_config
	// );
	new_puzzle_config.set_puz_config(new_puz_conf);
	return new_puzzle_config;
}

// Function to check if tile is movable
function isMovable(tile, puz_conf) {
	// Get empty tile
	const emptyTile = document.getElementById(9);

	// Check if tile is in same row or column as empty tile
	if (tile.id === emptyTile.id) {
		return false;
	}

	// Check if tile is in same row as empty tile
	// get its index in the puzzleconfig
	const index = puz_conf.get_puz_config().indexOf(parseInt(tile.id));
	const emptyIndex = puz_conf.get_puz_config().indexOf(9);

	// check if they are in the same row
	if (Math.floor(index / 3) === Math.floor(emptyIndex / 3)) {
		// check if there is a tile between them
		// find the difference between the indices, if its greater than one, they are not together.
		if (Math.abs(index - emptyIndex) > 1) {
			return false;
		} else {
			return true;
		}
	}

	// check if they are in the same column
	if (index % 3 === emptyIndex % 3) {
		// check if there is a tile between them
		// find the difference between the indices, if its greater than 3, they are not together.
		if (Math.abs(index - emptyIndex) > 3) {
			return false;
		} else {
			return true;
		}
	}
	return false;
}

// Function to check if puzzle is solved
function isSolved() {
	// Check if puzzle configuration is equal to initial puzzle configuration
	return (
		JSON.stringify(board_puz_conf.get_puz_config()) ===
		JSON.stringify([1, 2, 3, 4, 5, 6, 7, 8, 9])
	);
}

function check_if_puz_conf_is_sol(puz_conf) {
	// Check if puzzle configuration is equal to initial puzzle configuration
	return (
		JSON.stringify(puz_conf.get_puz_config()) ===
		JSON.stringify([1, 2, 3, 4, 5, 6, 7, 8, 9])
	);
}

// Function to shuffle puzzle
function shuffle() {
	// Shuffle puzzle configuration
	let current_puz_conf = board_puz_conf.get_puz_config();
	current_puz_conf.sort(() => Math.random() - 0.5);
	board_puz_conf.set_puz_config(current_puz_conf);

	// Update puzzle board
	updatePuzzleBoard();
}

// Function to calculate Manhattan Distance for a given tile
function manhattanDistanceOfTile(tile, targetPosition, puzconfig) {
	const currentPosition = puzconfig.indexOf(parseInt(tile.id));
	const currentRow = Math.floor(currentPosition / 3);
	const currentCol = currentPosition % 3;

	const targetRow = Math.floor(targetPosition / 3);
	const targetCol = targetPosition % 3;

	return Math.abs(currentRow - targetRow) + Math.abs(currentCol - targetCol);
}

// Function to calculate the manhattan distance heuristic for a given puzzle configuration
function FindPuzConfManhattanHeuristic(puz_conf) {
	let given_puz_conf = puz_conf.get_puz_config();
	// Calculate the Manhattan Distance for each tile
	const heuristicValues = given_puz_conf.map((number) =>
		manhattanDistanceOfTile(number, number - 1, given_puz_conf)
	);

	// find the sum of the heuristic values
	const heuristicSum = heuristicValues.reduce((a, b) => a + b, 0);

	puz_conf.set_manhattan_heuristic(heuristicSum);
}

// Function to calculate the hamming distance heuristic for a given puzzle configuration
function FindHammingDistanceHeuristic(puzconfig) {
	let hamming_distance = 0;
	let given_puz_conf = puzconfig.get_puz_config();
	// calculate the number of misplaced tiles
	given_puz_conf.forEach((number) => {
		// check if the number is equal to the index + 1
		if (number !== 9 && number !== given_puz_conf.indexOf(number) + 1) {
			hamming_distance++;
		}
	});

	puzconfig.set_hamming_heuristic(hamming_distance);
}

// Function to find both heuristics for a given puzzle configuration
function find_heuristics_for_puzconf(puz_conf) {
	FindPuzConfManhattanHeuristic(puz_conf);
	FindHammingDistanceHeuristic(puz_conf);
}

// Function to solve puzzle using A* algorithm
function solve() {
	// Check if puzzle is already solved
	if (isSolved()) {
		console.log("The puzzle is already solved");
		return;
	}

	// find the heuristics for the current puzzle configuration.
	find_heuristics_for_puzconf(board_puz_conf);

	open_set = [board_puz_conf];
	closed_set = [];

	while (open_set.length > 0) {
		// find the puzzle configuration with the lowest f score
		let lowest_f_score = Math.min(
			...open_set.map((puz_conf) => puz_conf.get_f_score())
		);
		let current_puz_conf = open_set.find(
			(puz_conf) => puz_conf.get_f_score() === lowest_f_score
		);

		// check if the current puzzle configuration is the solution
		if (check_if_puz_conf_is_sol(current_puz_conf)) {
			console.log("The puzzle is solved");
			// find the path to the solution
			let path = [];
			let current = current_puz_conf;
			while (current !== null) {
				path.push(current);
				current = current.get_parent();
			}
			// animate the solution using the movetile method.
			path.reverse();
			console.log(path);

			let i = 1;
			let interval = setInterval(() => {
				if (i === path.length) {
					clearInterval(interval);
					return;
				}
				moveTile(path[i].get_tile_moved());
				i++;
			}, 500);
			return;
		}

		// remove the current puzzle configuration from the open set
		open_set = open_set.filter(
			(puz_conf) =>
				puz_conf.get_puz_config() !== current_puz_conf.get_puz_config()
		);

		// add the current puzzle configuration to the closed set
		closed_set.push(current_puz_conf);

		// find the possible moves from the current puzzle configuration
		const possible_moves = [];
		current_puz_conf.get_puz_config().forEach((number) => {
			if (isMovable(document.getElementById(number), current_puz_conf)) {
				possible_moves.push(number);
			}
		});

		// for each possible move, create a new puzzle configuration and add it to the open set
		possible_moves.forEach((move) => {
			let new_puz_conf = pseudo_moveTile(move, current_puz_conf);
			// check if the new puzzle configuration is already in the closed set
			if (
				closed_set.some((puz_conf) =>
					comparePuzzleConfigurations(
						puz_conf.get_puz_config(),
						new_puz_conf.get_puz_config()
					)
				)
			) {
				return;
			}
			// check if the new puzzle configuration is already in the open set
			if (
				open_set.some((puz_conf) =>
					comparePuzzleConfigurations(
						puz_conf.get_puz_config(),
						new_puz_conf.get_puz_config()
					)
				)
			) {
				return;
			}
			// add the new puzzle configuration to the open set
			find_heuristics_for_puzconf(new_puz_conf);
			open_set.push(new_puz_conf);
		});

		// log everything
		console.log(
			"_______________________________________________________________"
		);
		console.log("open set: ", open_set);
		console.log("closed set: ", closed_set);
		console.log("current puzzle configuration: ", current_puz_conf);
		console.log("possible moves: ", possible_moves);
		console.log("lowest f score: ", lowest_f_score);
		console.log(
			"current puzzle configuration f score: ",
			current_puz_conf.get_f_score()
		);
		console.log(
			"current puzzle configuration g score: ",
			current_puz_conf.get_g_score()
		);
		console.log(
			"current puzzle configuration h score: ",
			current_puz_conf.final_heuristic
		);
		console.log(
			"_______________________________________________________________\n\n\n\n"
		);
	}
}
