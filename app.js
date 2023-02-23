// Player factory
// assigment can be "X" or "O"
// Player should do: give Assigment to other
const Player = (assignment) => {
	const getPlayerAssigment = () => assignment;
	return { getPlayerAssigment };
};

// ///////////////////// create GameBoard ///////////////////////
// Module Pattern IIFE
// Gameboard should do: set assigment to array, give assigment to other, reset array

const GameBoard = (() => {
	const board = ["", "", "", "", "", "", "", "", ""];

	const setGameBoard = (index, assigment) => {
		board[index] = assigment;
	};

	const getGameBoard = () => board;

	const resetGameBoard = () => {
		for (let i = 0; i < board.length; i += 1) {
			board[i] = "";
		}
	};

	return { setGameBoard, getGameBoard, resetGameBoard };
})();

// ///////////////////// create GameController ///////////////////////
// GameController should do: calc game logic and win conditions
const GameController = (() => {
	// generate new Players
	const playerX = Player("X");
	const playerO = Player("O");
	let roundNumber = 1;
	let gameOver = false;

	// find out which player's turn it is
	// Player X always starts
	const getCurrentPlayerAssigment = () => {
		if (roundNumber % 2 === 1) {
			DisplayController.gameMessage(playerO.getPlayerAssigment());
			return playerX.getPlayerAssigment();
		}
		if (roundNumber % 2 === 0) {
			DisplayController.gameMessage(playerX.getPlayerAssigment());
			return playerO.getPlayerAssigment();
		}
	};

	const gameLogic = () => {
		//
		//     |   |
		//   0 | 1 | 2
		// ----+---+----
		//   3 | 4 | 5
		// ----+---+----
		//   6 | 7 | 8
		//     |   |
		//

		const winningConditions = [
			[0, 1, 2],
			[3, 4, 5],
			[6, 7, 8],
			[0, 3, 6],
			[1, 4, 7],
			[2, 5, 8],
			[0, 4, 8],
			[2, 4, 6],
		];

		// ✨ NEW (and better????)✨
		const gameState = GameBoard.getGameBoard();
		let roundWon = false;
		for (let i = 0; i < 8; i += 1) {
			const winCondition = winningConditions[i];
			const a = gameState[winCondition[0]];
			const b = gameState[winCondition[1]];
			const c = gameState[winCondition[2]];

			if (a !== "" || b !== "" || c !== "") {
				if (a === b && b === c) {
					roundWon = true;
					break;
				}
			}
		}
		return roundWon;
	};

	const reset = () => {
		roundNumber = 1;
		gameOver = false;
	};

	const playRound = (gameBoardIndex) => {
		GameBoard.setGameBoard(gameBoardIndex, getCurrentPlayerAssigment());
		DisplayController.updateGameBoard();

		if (gameLogic()) {
			DisplayController.winnerMessage(getCurrentPlayerAssigment());
			gameOver = true;
		}

		if (roundNumber === 9) {
			DisplayController.winnerMessage("Draw");
			gameOver = true;
		}
		roundNumber += 1;
	};

	const getGameOver = () => gameOver;

	return { playRound, getGameOver, reset };
})();

// ///////////////////// create DisplayController ///////////////////////
// DisplayController should do: manage dom stuff and event listeners

const DisplayController = (() => {
	const boardListener = (selector) => {
		document.querySelector(selector).addEventListener("click", (e) => {
			if (e.target.classList.contains("grid-item")) {
				if (
					GameBoard.getGameBoard()[e.target.id] === "" &&
					GameController.getGameOver() === false
				) {
					GameController.playRound(e.target.id);
				}
			}
		});
	};
	boardListener(".grid-container");

	const buttonListener = (selector) => {
		document.querySelector(selector).addEventListener("click", () => {
			GameBoard.resetGameBoard();
			GameController.reset();
			DisplayController.updateGameBoard();
			gameMessage("X");
		});
	};
	buttonListener("button");

	const winnerMessage = (winner) => {
		const writeToDom = (selector) => {
			if (winner === "Draw") {
				document.querySelector(selector).innerText = "Its a Draw :/";
			} else {
				document.querySelector(
					selector
				).innerText = `The Winner is ${winner}`;
			}
		};
		writeToDom(".message");
	};

	const gameMessage = (player) => {
		const writeToDom = (selector) => {
			document.querySelector(
				selector
			).innerText = `Player ${player}'s turn`;
		};
		writeToDom(".message");
	};

	const updateGameBoard = () => {
		const array = GameBoard.getGameBoard();

		const writeToDOM = (selector) => {
			document.querySelectorAll(selector).forEach((e, i) => {
				e.innerText = array[i];
			});
		};
		writeToDOM(".grid-item");
	};

	return { updateGameBoard, winnerMessage, gameMessage };
})();
