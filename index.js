// Sample puzzle configuration (numbers represent puzzle pieces)
const puzzleConfiguration = [1, 2, 3, 4, 5, 6, 7, 8, 0]; // 0 represents the empty space

// Function to create puzzle board
function createPuzzleBoard() {
	const puzzleBoard = document.getElementById("puzzle-board");
	console.log(puzzleBoard);
	puzzleConfiguration.forEach((number) => {
		if (number === 0) {
			// Create empty grid item
			const gridItem = document.createElement("div");
			gridItem.className =
				"puzzle-item bg-transparent text-4xl rounded-md w-28 h-28 flex items-center justify-center";
			gridItem.id = "empty";
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

createPuzzleBoard();

function updatePuzzleBoard() {
	const puzzleBoard = document.getElementById("puzzle-board");
	puzzleBoard.innerHTML = "";
	createPuzzleBoard();
}

// Function to move tile
function moveTile(number) {
	const emptyTile = document.getElementById("empty");
	const tile = document.getElementById(number);

	// Check if tile is movable
	if (isMovable(tile)) {
		// Move tile
		emptyTile.textContent = number;
		emptyTile.id = number;
		tile.textContent = "";
		tile.id = "empty";
	}
}

// Function to check if tile is movable
function isMovable(tile) {
	const emptyTile = document.getElementById("empty");

	// Check if tile is in same row or column as empty tile
	if (tile.id === emptyTile.id) {
		return false;
	}

	// Check if tile is in same row as empty tile
	if (tile.parentNode === emptyTile.parentNode) {
		return true;
	}

	// Check if tile is in same column as empty tile
	if (tile.previousSibling === emptyTile || tile.nextSibling === emptyTile) {
		return true;
	}

	return false;
}

// Function to check if puzzle is solved
function isSolved() {
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

// Define the PuzzleState class
class PuzzleState {
	static goalState = [1, 2, 3, 4, 5, 6, 7, 8, 0];
	static moves = {
		0: [1, 3],
		1: [0, 2, 4],
		2: [1, 5],
		3: [0, 4, 6],
		4: [1, 3, 5, 7],
		5: [2, 4, 8],
		6: [3, 7],
		7: [4, 6, 8],
		8: [5, 7],
	};
	constructor(state) {
		this.state = state;
		this.gScore = 0;
		this.fScore = this.gScore + this.heuristic();
	}

	// Define the heuristic function (Manhattan distance)
	heuristic() {
		let distance = 0;
		for (let i = 0; i < this.state.length; i++) {
			if (this.state[i] !== 0) {
				distance +=
					Math.abs(
						(i % 3) -
							(PuzzleState.goalState.indexOf(this.state[i]) % 3)
					) +
					Math.abs(
						Math.floor(i / 3) -
							Math.floor(
								PuzzleState.goalState.indexOf(this.state[i]) / 3
							)
					);
			}
		}
		return distance;
	}

	// Define the equals function
	equals(other) {
		return this.state.join("") === other.state.join("");
	}

	// Define the getNeighbors function
	getNeighbors() {
		let neighbors = [];
		let index = this.state.indexOf(0);
		for (let i = 0; i < PuzzleState.moves[index].length; i++) {
			let neighbor = this.state.slice();
			let swapIndex = PuzzleState.moves[index][i];
			[neighbor[index], neighbor[swapIndex]] = [
				neighbor[swapIndex],
				neighbor[index],
			];
			neighbors.push(new PuzzleState(neighbor));
		}
		return neighbors;
	}
}

// Define the PuzzleSolver class
class PuzzleSolver {
	constructor(startState) {
		this.startState = startState;
		this.openSet = [startState];
		this.closedSet = [];
	}

	// Define the solve function
	solve() {
		while (this.openSet.length > 0) {
			let current = this.openSet[0];
			let currentIndex = 0;
			for (let i = 1; i < this.openSet.length; i++) {
				if (this.openSet[i].fScore < current.fScore) {
					current = this.openSet[i];
					currentIndex = i;
				}
			}
			if (current.state.join("") === PuzzleState.goalState.join("")) {
				let solution = [current.state[current.state.indexOf(0) ^ 1]];
				while (current !== this.startState) {
					current = this.closedSet.find((state) =>
						state.equals(current.parent)
					);
					solution.unshift(
						current.state[current.state.indexOf(0) ^ 1]
					);
				}
				return solution;
			}
			this.openSet.splice(currentIndex, 1);
			this.closedSet.push(current);
			let neighbors = current.getNeighbors();
			for (let i = 0; i < neighbors.length; i++) {
				let neighbor = neighbors[i];
				if (this.closedSet.some((state) => state.equals(neighbor))) {
					continue;
				}
				let tentativeGScore = current.gScore + 1;
				if (!this.openSet.some((state) => state.equals(neighbor))) {
					neighbor.gScore = tentativeGScore;
					neighbor.fScore = neighbor.gScore + neighbor.heuristic();
					neighbor.parent = current;
					this.openSet.push(neighbor);
				} else if (tentativeGScore >= neighbor.gScore) {
					continue;
				}
				neighbor.gScore = tentativeGScore;
				neighbor.fScore = neighbor.gScore + neighbor.heuristic();
				neighbor.parent = current;
			}
		}
		return null;
	}
}

// Function to solve puzzle using A* algorithm
function solve() {
	// Check if puzzle is already solved
	if (isSolved()) {
		return;
	}

	// Create puzzle state
	const puzzleState = new PuzzleState(puzzleConfiguration);

	// Create puzzle solver
	const puzzleSolver = new PuzzleSolver(puzzleState);

	// Solve puzzle
	const solution = puzzleSolver.solve();

	// Animate solution
	animateSolution(solution);
}

// Function to animate solution
function animateSolution(solution) {
	// Check if puzzle is already solved
	if (isSolved()) {
		return;
	}

	// Animate solution
	for (let i = 0; i < solution.length; i++) {
		setTimeout(() => {
			moveTile(solution[i]);
		}, i * 500);
	}
}

// Function to reset puzzle
function reset() {
	// Reset puzzle configuration
	puzzleConfiguration.sort();

	// Update puzzle board
	updatePuzzleBoard();
}

// Function to clear puzzle
function clear() {
	// Clear puzzle configuration
	puzzleConfiguration.fill(0);

	// Update puzzle board
	updatePuzzleBoard();
}

// Function to show puzzle configuration
function showConfiguration() {
	// Show puzzle configuration
	alert(puzzleConfiguration);
}

// Function to show puzzle state
function showState() {
	// Create puzzle state
	const puzzleState = new PuzzleState(puzzleConfiguration);

	// Show puzzle state
	alert(puzzleState);
}

// Function to show puzzle solver
function showSolver() {
	// Create puzzle state
	const puzzleState = new PuzzleState(puzzleConfiguration);

	// Create puzzle solver
	const puzzleSolver = new PuzzleSolver(puzzleState);

	// Show puzzle solver
	alert(puzzleSolver);
}

// Function to show puzzle solution
function showSolution() {
	// Create puzzle state
	const puzzleState = new PuzzleState(puzzleConfiguration);

	// Create puzzle solver
	const puzzleSolver = new PuzzleSolver(puzzleState);

	// Solve puzzle
	const solution = puzzleSolver.solve();

	// Show puzzle solution
	alert(solution);
}
