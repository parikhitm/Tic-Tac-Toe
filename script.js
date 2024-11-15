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
    let currentPlayer = playerX;
    let gameOver = false;
  
    const switchPlayer = () => {
      currentPlayer = currentPlayer === playerX ? playerO : playerX;
    };
  
    const playTurn = (index) => {
      if (!gameOver && Gameboard.updateCell(index, currentPlayer.marker)) {
        if (checkWin()) {
          gameOver = true;
          displayController.displayWinner(currentPlayer.name);
        } else if (isTie()) {
          gameOver = true;
          displayController.displayTie();
        } else {
          switchPlayer();
        }
        displayController.updateBoard();
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
      displayController.setMessage("");
    };
  
    return { playTurn, resetGame };
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
    const displayWinner = (winner) => {
      messageDisplay.textContent = `${winner} wins!`;
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
  
    return { updateBoard, displayWinner, displayTie, setMessage };
  })();