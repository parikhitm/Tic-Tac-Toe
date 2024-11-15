// Gameboard Module
const Gameboard = (() => {
  const board = ["", "", "", "", "", "", "", "", ""];

  const getBoard = () => board;

  const updateCell = (index, marker) => {
    if (board[index] === "") {
      board[index] = marker;
      return true;
    }
    return false;
  };

  const resetBoard = () => {
    for (let i = 0; i < board.length; i++) {
      board[i] = "";
    }
  };

  return { getBoard, updateCell, resetBoard };
})();

// Player Factory Function
const createPlayer = (name, marker) => {
  return { name, marker };
};

// Game Module
const Game = (() => {
  const playerX = createPlayer("Player X", "X");
  const playerO = createPlayer("Player O", "O");
  const getCurrentPlayerName = () => currentPlayer.name;
  let currentPlayer = playerX;
  let gameOver = false;

  const setPlayerNames = (name1, name2) => {
    playerX.name = name1 || 'Player 1';
    playerO.name = name2 || 'Player 2';
    currentPlayer = playerX;
    displayController.setMessage(`${currentPlayer.name}'s turn`);
  };

  const switchPlayer = () => {
    currentPlayer = currentPlayer === playerX ? playerO : playerX;
    displayController.setMessage(`${currentPlayer.name}'s turn`);
  };

  const playTurn = (index) => {
    if (gameOver || !Gameboard.updateCell(index, currentPlayer.marker)) {
      return;
    }

    displayController.updateBoard();

    if (checkWin()) {
      gameOver = true;
      displayController.displayWinner(currentPlayer.name);
    } else if (isTie()) {
      gameOver = true;
      displayController.displayTie();
    } else {
      switchPlayer();
    }
  };

  const checkWin = () => {
    const board = Gameboard.getBoard();
    const winConditions = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];

    return winConditions.some((condition) =>
      condition.every((index) => board[index] === currentPlayer.marker)
    );
  };

  const isTie = () => {
    return Gameboard.getBoard().every((cell) => cell !== "");
  };

  const resetGame = () => {
    Gameboard.resetBoard();
    currentPlayer = playerX;
    gameOver = false;
    displayController.updateBoard();
    displayController.setMessage(`${currentPlayer.name}'s turn`);
  };

  return { playTurn, resetGame, setPlayerNames, getCurrentPlayerName };
})();

// Display Controller Module
const displayController = (() => {
  const boardElement = document.getElementById("board");
  const messageDisplay = document.getElementById("message");
  const restartButton = document.getElementById("restart-button");

  // Create the game board cells
  const createBoard = () => {
    boardElement.innerHTML = ""; // Clear any existing board
    for (let i = 0; i < 9; i++) {
      const cell = document.createElement("div");
      cell.classList.add("cell");
      cell.dataset.index = i;

      cell.addEventListener("click", () => {
        Game.playTurn(i);
      });

      boardElement.appendChild(cell);
    }
  };

  // Update the game board display
  const updateBoard = () => {
    const board = Gameboard.getBoard();
    const cells = document.querySelectorAll(".cell");

    cells.forEach((cell, index) => {
      cell.textContent = board[index];
    });
  };

  // Display the winner message
  const displayWinner = (winnerName) => {
    messageDisplay.textContent = `${winnerName} wins!`;
  };

  // Display the tie message
  const displayTie = () => {
    messageDisplay.textContent = "It's a tie!";
  };

  // Set a custom message
  const setMessage = (message) => {
    messageDisplay.textContent = message;
  };

  // Restart button listener
  restartButton.addEventListener("click", () => {
    Game.resetGame();
  });

  // Initialize the game board when the page loads
  createBoard();
  updateBoard();
  setMessage(`${Game.getCurrentPlayerName()}'s turn`);

  return { updateBoard, displayWinner, displayTie, setMessage };
})();




// Get modal elements
const newGameButton = document.getElementById('new-game-button');
const newGameModal = document.getElementById('new-game-modal');
const closeModalButton = document.querySelector('.close-button');
const newGameForm = document.getElementById('new-game-form');

// Open modal when 'New Game' button is clicked
newGameButton.addEventListener('click', () => {
  newGameModal.style.display = 'block';
});

// Close modal when 'x' is clicked
closeModalButton.addEventListener('click', () => {
  newGameModal.style.display = 'none';
});

// Close modal when clicking outside of modal content
window.addEventListener('click', (event) => {
  if (event.target === newGameModal) {
    newGameModal.style.display = 'none';
  }
});

// Handle form submission to start a new game with player names
newGameForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const player1Name = document.getElementById('player1-name').value.trim() || 'Player 1';
  const player2Name = document.getElementById('player2-name').value.trim() || 'Player 2';

  // Set player names in the Game module
  Game.setPlayerNames(player1Name, player2Name);

  // Reset the game
  Game.resetGame();

  // Close the modal
  newGameModal.style.display = 'none';

  // Clear form fields
  newGameForm.reset();
});