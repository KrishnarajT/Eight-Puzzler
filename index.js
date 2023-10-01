// Sample puzzle configuration (numbers represent puzzle pieces)
var puzzleConfiguration = [2, 8, 4, 6, 9, 3, 1, 7, 5]; // 9 represents the empty space
var puz_confs = [];


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
	puzzleConfiguration.forEach((number) => {
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

	// Check if tile is movable
	if (isMovable(tile)) {
		// change the puzzle configuration
		const index = puzzleConfiguration.indexOf(parseInt(number));
		const zeroIndex = puzzleConfiguration.indexOf(9);
		puzzleConfiguration[index] = 9;
		puzzleConfiguration[zeroIndex] = parseInt(number);
		console.log(puzzleConfiguration);
		updatePuzzleBoard();
	}
}

// Function to move tile
function pseudo_moveTile(number) {
	const tile = document.getElementById(number);

	// change the puzzle configuration
	const index = puzzleConfiguration.indexOf(parseInt(number));
	const zeroIndex = puzzleConfiguration.indexOf(9);
	const new_puzzle_config = puzzleConfiguration.slice();
	new_puzzle_config[index] = 9;
	new_puzzle_config[zeroIndex] = parseInt(number);
	console.log(
		"Testing moveTile",
		number,
		" new:",
		puzzleConfiguration,
		"vs old:",
		new_puzzle_config
	);
	return new_puzzle_config;
}

// Function to check if tile is movable
function isMovable(tile) {
	// Get empty tile
	const emptyTile = document.getElementById(9);

	// Check if tile is in same row or column as empty tile
	if (tile.id === emptyTile.id) {
		return false;
	}

	// Check if tile is in same row as empty tile
	// get its index in the puzzleconfig
	const index = puzzleConfiguration.indexOf(parseInt(tile.id));
	const emptyIndex = puzzleConfiguration.indexOf(9);

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
	return JSON.stringify(puzzleConfiguration) === JSON.stringify([1, 2, 3, 4, 5, 6, 7, 8, 9]);
}

// Function to shuffle puzzle
function shuffle() {
	// Shuffle puzzle configuration
	puzzleConfiguration.sort(() => Math.random() - 0.5);

	// Update puzzle board
	updatePuzzleBoard();
}

// Function to calculate Manhattan Distance for a given tile
function manhattanDistance(tile, targetPosition, puzconfig) {
	const currentPosition = puzconfig.indexOf(parseInt(tile.id));
	const currentRow = Math.floor(currentPosition / 3);
	const currentCol = currentPosition % 3;

	const targetRow = Math.floor(targetPosition / 3);
	const targetCol = targetPosition % 3;

	return Math.abs(currentRow - targetRow) + Math.abs(currentCol - targetCol);
}

function hammingDistance(puzconfig) {
	let hamming_distance = 0;
	// calculate the number of misplaced tiles
	puzconfig.forEach((number) => {
		// check if the number is equal to the index + 1
		if (number !== 9 && number !== puzconfig.indexOf(number) + 1) {
			hamming_distance++;
		}
	});
	return hamming_distance;
}

// Function to solve puzzle using A* algorithm
function solve() {
	// Check if puzzle is already solved
	if (isSolved()) {
		return;
	}
	console.log(puzzleConfiguration);
	console.log(isSolved());

	// Calculate the Manhattan Distance for each tile
	const heuristicValues = puzzleConfiguration.map((number) =>
		number === 0
			? manhattanDistance(document.getElementById(number), 9, puzzleConfiguration) 
			: manhattanDistance(document.getElementById(number), number - 1, puzzleConfiguration) 
	);

	// find the sum of the heuristic values
	const heuristicSum = heuristicValues.reduce((a, b) => a + b, 0);

	console.log("h values", heuristicValues);
	console.log("h sum", heuristicSum);

	// order the tiles by their heuristic values
	const orderedTiles = puzzleConfiguration.map((number) =>
		document.getElementById(number)
	);
	orderedTiles.sort((a, b) => {
		const aIndex = puzzleConfiguration.indexOf(parseInt(a.id));
		const bIndex = puzzleConfiguration.indexOf(parseInt(b.id));
		return heuristicValues[aIndex] - heuristicValues[bIndex];
	});


	// check if each of those tiles is movable, if it is then find the new heuristic sum of the resulting config by moving that tile. do this for all tiles, and then finally check which sum was the lowest. move that tile.
	let min_heuristic_sum_tile;
	const possible_heuristic_sums = [];
	orderedTiles.forEach((tile) => {
		if (isMovable(tile)) {
			const new_puzzle_config = pseudo_moveTile(tile.id);
			if (puz_confs.some((puz_conf) => comparePuzzleConfigurations(puz_conf, new_puzzle_config))) {
				return;
			}
			console.log("new puzzle config", new_puzzle_config, "is not part of ", puz_confs)
			const new_heuristic_values = new_puzzle_config.map((number) =>
				number === 0
					? manhattanDistance(
							document.getElementById(number),
							9,
							new_puzzle_config
					  )
					: manhattanDistance(
							document.getElementById(number),
							number - 1,
							new_puzzle_config
					  )
			);
			console.log("new h values for tile ", tile, new_heuristic_values);
			const new_heuristic_sum = new_heuristic_values.reduce(
				(a, b) => a + b,
				0
			);
			const new_hamming_distance = hammingDistance(new_puzzle_config);
			possible_heuristic_sums.push({
				manhatten_heuristic_sum: new_heuristic_sum,
				hamming_distance: new_hamming_distance,
                final_heuristic_sum: new_heuristic_sum + new_hamming_distance,
                puz_conf: new_puzzle_config,
				tile_id: tile.id,
			});
		}
	});
    
	// find lowest heuristic sum tile to move
	const min_heuristic_sum = Math.min(
		...possible_heuristic_sums.map((item) => item.final_heuristic_sum)
	);
	min_heuristic_sum_tile = possible_heuristic_sums.find(
		(item) => item.final_heuristic_sum === min_heuristic_sum
	);

	console.log("The heurestics were: ", possible_heuristic_sums);
	console.log(
		"After trying all movable configs, the lowest heuristic sum is",
		min_heuristic_sum_tile
	);

	console.log("Moving tile", min_heuristic_sum_tile);

	setTimeout(() => {
		moveTile(min_heuristic_sum_tile.tile_id);
		puz_confs.push(min_heuristic_sum_tile.puz_conf);
	}, 80);
	setTimeout(() => {
		solve();
	}, 80);
}
