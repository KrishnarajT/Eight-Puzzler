// Sample puzzle configuration (numbers represent puzzle pieces)
const puzzleConfiguration = [1, 2, 3, 4, 5, 6, 7, 8, 0]; // 0 represents the empty space

// Function to create puzzle board
function createPuzzleBoard() {
	// Get puzzle board element
	const puzzleBoard = document.getElementById("puzzle-board");

	// Loop through puzzle configuration
	puzzleConfiguration.forEach((number) => {
		if (number === 0) {
			// Create empty grid item
			const gridItem = document.createElement("div");
			gridItem.className =
				"puzzle-item bg-transparent text-4xl rounded-md w-28 h-28 flex items-center justify-center";
			gridItem.id = 0;
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
function moveTile(number, current_puzzle_config) {
	const tile = document.getElementById(number);

	// Check if tile is movable
	if (isMovable(tile)) {
		// change the puzzle configuration
		const index = puzzleConfiguration.indexOf(parseInt(number));
		const zeroIndex = puzzleConfiguration.indexOf(0);
		puzzleConfiguration[index] = 0;
		puzzleConfiguration[zeroIndex] = parseInt(number);
        console.log(puzzleConfiguration);
        
        // if the puzzle config is the same as the initial one, return
        if (JSON.stringify(puzzleConfiguration) === JSON.stringify(current_puzzle_config)) {
            // change to the previous puzzle config
            puzzleConfiguration[index] = parseInt(number);
            puzzleConfiguration[zeroIndex] = 0;
            return;
        }
		updatePuzzleBoard();
	}
}

// Function to check if tile is movable
function isMovable(tile) {
	// Get empty tile
	const emptyTile = document.getElementById(0);

	// Check if tile is in same row or column as empty tile
	if (tile.id === emptyTile.id) {
		return false;
	}

	// Check if tile is in same row as empty tile
	// get its index in the puzzleconfig
	const index = puzzleConfiguration.indexOf(parseInt(tile.id));
	const emptyIndex = puzzleConfiguration.indexOf(0);

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

	// Check if tile is in same column as empty tile
	if (tile.previousSibling === emptyTile || tile.nextSibling === emptyTile) {
		return true;
	}

	return false;
}

// Function to check if puzzle is solved
function isSolved() {
	// Get puzzle board element and puzzle items
	const puzzleBoard = document.getElementById("puzzle-board");
	const puzzleItems = puzzleBoard.childNodes;

	// Check if puzzle items are in correct order
	for (let i = 0; i < puzzleItems.length - 1; i++) {
		if (puzzleItems[i].id !== puzzleItems[i + 1].textContent) {
			return false;
		}
	}

	return true;
}

// Function to shuffle puzzle
function shuffle() {
	// Shuffle puzzle configuration
	puzzleConfiguration.sort(() => Math.random() - 0.5);

	// Update puzzle board
	updatePuzzleBoard();
}

// Function to calculate Manhattan Distance for a given tile
function manhattanDistance(tile, targetPosition) {
    const currentPosition = puzzleConfiguration.indexOf(parseInt(tile.id));
    const currentRow = Math.floor(currentPosition / 3);
    const currentCol = currentPosition % 3;

    const targetRow = Math.floor(targetPosition / 3);
    const targetCol = targetPosition % 3;

    return Math.abs(currentRow - targetRow) + Math.abs(currentCol - targetCol);
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
			? manhattanDistance(document.getElementById(number), 9)
			: manhattanDistance(document.getElementById(number), number - 1)
	);

	// Find the tile with the minimum Manhattan Distance (heuristic value)
	const minHeuristicValue = Math.min(...heuristicValues);
	const minHeuristicIndex = heuristicValues.indexOf(minHeuristicValue);
	const minHeuristicTile = document.getElementById(
		puzzleConfiguration[minHeuristicIndex]
    );
    
    // order the tiles by their heuristic values
    const orderedTiles = puzzleConfiguration.map((number) => document.getElementById(number));
    orderedTiles.sort((a, b) => {
        const aIndex = puzzleConfiguration.indexOf(parseInt(a.id));
        const bIndex = puzzleConfiguration.indexOf(parseInt(b.id));
        return heuristicValues[aIndex] - heuristicValues[bIndex];
    });

    const current_puzzle_config = puzzleConfiguration.slice();
    // try to move them in order
    orderedTiles.forEach((tile) => {
        // make sure the puzzle config is not the same as the initial one
        if (isMovable(tile)) {
            moveTile(tile.id, current_puzzle_config);
            // wait for 1 second
            setTimeout(solve, 1000);
        }
    });
}
