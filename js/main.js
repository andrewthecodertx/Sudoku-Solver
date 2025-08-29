import { GRID_SIZE, BOX_SIZE } from './constants.js';
import { generateSudoku } from './generate.js';
import { solveSudoku, isValidSudoku } from './solve.js';

const canvas = document.getElementById('grid');
const ctx = canvas.getContext('2d');
const solveButton = document.getElementById('solve');
const numberPad = document.getElementById('number-pad');

let cellSize;
let puzzle = Array(GRID_SIZE).fill(null).map(() => Array(GRID_SIZE).fill(0));
let initialPuzzle = Array(GRID_SIZE).fill(null).map(() => Array(GRID_SIZE).fill(0));
let selectedCell = { row: -1, col: -1 };

/**
 * Resizes the canvas to fit the window.
 * @returns {void}
 */
function resizeCanvas() {
  const size = Math.min(window.innerWidth * 0.9, window.innerHeight * 0.7);

  canvas.width = size;
  canvas.height = size;
  cellSize = canvas.width / GRID_SIZE;
  solveButton.disabled = true;
  checkPuzzleButton.disabled = true;
  redraw();
}

/**
 * Draws the grid lines on the canvas.
 * @returns {void}
 */
function drawGrid() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.strokeStyle = '#000';

  // thin lines
  ctx.lineWidth = 1;
  for (let i = 0; i <= GRID_SIZE; i++) {
    ctx.beginPath();
    ctx.moveTo(i * cellSize, 0);
    ctx.lineTo(i * cellSize, canvas.height);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(0, i * cellSize);
    ctx.lineTo(canvas.width, i * cellSize);
    ctx.stroke();
  }

  // thick lines
  ctx.lineWidth = 3;
  for (let i = 0; i <= GRID_SIZE; i++) {
    if (i % BOX_SIZE === 0) {
      ctx.beginPath();
      ctx.moveTo(i * cellSize, 0);
      ctx.lineTo(i * cellSize, canvas.height);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(0, i * cellSize);
      ctx.lineTo(canvas.width, i * cellSize);
      ctx.stroke();
    }
  }
}

/**
 * Draws the numbers on the canvas.
 * @returns {void}
 */
function drawNumbers() {
  ctx.font = `${cellSize * 0.6}px sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  const selectedNum = selectedCell.row !== -1 ? puzzle[selectedCell.row][selectedCell.col] : 0;

  for (let row = 0; row < GRID_SIZE; row++) {
    for (let col = 0; col < GRID_SIZE; col++) {
      const num = puzzle[row][col];
      if (num !== 0) {
        // highlight all cells with the same number as the selected cell
        if (num === selectedNum && selectedNum !== 0) {
          ctx.fillStyle = 'rgba(100, 100, 255, 0.3)';
          ctx.fillRect(col * cellSize, row * cellSize, cellSize, cellSize);
        }

        // set the color of the number
        if (initialPuzzle[row][col] !== 0) {
          ctx.fillStyle = '#000'; // original puzzle numbers are black
        } else {
          ctx.fillStyle = '#333399'; // user entered numbers are dark blue
        }
        ctx.fillText(num, col * cellSize + cellSize / 2, row * cellSize + cellSize / 2);
      }
    }
  }
}

/**
 * Highlights the selected cell.
 * @returns {void}
 */
function highlightSelectedCell() {
  if (selectedCell.row !== -1 && selectedCell.col !== -1) {
    ctx.fillStyle = 'rgba(144, 238, 144, 0.5)'; // Light green with transparency
    ctx.fillRect(selectedCell.col * cellSize, selectedCell.row * cellSize, cellSize, cellSize);
  }
}

/**
 * Redraws the entire canvas.
 * @returns {void}
 */
function redraw() {
  drawGrid();
  highlightSelectedCell();
  drawNumbers();
  updateNumberPad();
}

canvas.addEventListener('click', (e) => {
  const rect = canvas.getBoundingClientRect();

  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;

  const col = Math.floor(x / cellSize);
  const row = Math.floor(y / cellSize);

  if (col >= 0 && col < GRID_SIZE && row >= 0 && row < GRID_SIZE) {
    selectedCell = { row, col };
    redraw();
  } else {
    selectedCell = { row: -1, col: -1 };
    redraw();
  }
});

window.addEventListener('keydown', (e) => {
  if (selectedCell.row !== -1 && selectedCell.col !== -1) {
    const key = parseInt(e.key);

    // handle number input and deletion
    if ((!isNaN(key) && key >= 1 && key <= 9) || e.key === 'Backspace' || e.key === 'Delete') {
      // prevent changing the original puzzle
      if (initialPuzzle[selectedCell.row][selectedCell.col] !== 0) {
        return;
      }

      if (!isNaN(key)) {
        const counts = {};
        for (let r = 0; r < GRID_SIZE; r++) {
          for (let c = 0; c < GRID_SIZE; c++) {
            const num = puzzle[r][c];
            if (num !== 0) {
              counts[num] = (counts[num] || 0) + 1;
            }
          }
        }
        if (!counts[key] || counts[key] < 9) {
          puzzle[selectedCell.row][selectedCell.col] = key;
          redraw();
        }
      } else { // Backspace or Delete
        puzzle[selectedCell.row][selectedCell.col] = 0;
        redraw();
      }
      updateButtonStates();
    } else { // handle navigation
      e.preventDefault();
      switch (e.key) {
        case 'ArrowUp':
        case 'k':
          selectedCell.row = (selectedCell.row - 1 + GRID_SIZE) % GRID_SIZE;
          break;
        case 'ArrowDown':
        case 'j':
          selectedCell.row = (selectedCell.row + 1) % GRID_SIZE;
          break;
        case 'ArrowLeft':
        case 'h':
          selectedCell.col = (selectedCell.col - 1 + GRID_SIZE) % GRID_SIZE;
          break;
        case 'ArrowRight':
        case 'l':
          selectedCell.col = (selectedCell.col + 1) % GRID_SIZE;
          break;
      }
      redraw();
    }
  }
});

const generatePuzzleButton = document.getElementById('generate-puzzle');
const clearPuzzleButton = document.getElementById('clear-puzzle');
const checkPuzzleButton = document.getElementById('check-puzzle');
const checkResultDiv = document.getElementById('check-result');

solveButton.addEventListener('click', () => {
  const solvedPuzzle = solveSudoku(puzzle);

  puzzle = solvedPuzzle;
  solveButton.disabled = true;
  redraw();
});

clearPuzzleButton.addEventListener('click', () => {
  puzzle = Array(GRID_SIZE).fill(null).map(() => Array(GRID_SIZE).fill(0));
  initialPuzzle = Array(GRID_SIZE).fill(null).map(() => Array(GRID_SIZE).fill(0));
  solveButton.disabled = true;
  checkPuzzleButton.disabled = true;
  generatePuzzleButton.disabled = false;
  checkResultDiv.textContent = '';
  checkResultDiv.style.visibility = 'hidden';
  redraw();
});

generatePuzzleButton.addEventListener('click', () => {
  //TODO: Add difficulty selection

  const cellsToRemove = Math.floor(Math.random() * 11) + 40; // Random number between 40 and 50

  puzzle = generateSudoku(cellsToRemove);
  initialPuzzle = structuredClone(puzzle);
  solveButton.disabled = false;
  checkPuzzleButton.disabled = false;
  generatePuzzleButton.disabled = true;
  redraw();
});

checkPuzzleButton.addEventListener('click', () => {
  if (isValidSudoku(puzzle)) {
    checkResultDiv.textContent = 'Puzzle is valid!';
    checkResultDiv.style.color = 'green';
  } else {
    checkResultDiv.textContent = 'Puzzle is NOT valid.';
    checkResultDiv.style.color = 'red';
  }
  checkResultDiv.style.visibility = 'visible';
});

window.addEventListener('resize', resizeCanvas);

// initial draw
resizeCanvas();


numberPad.addEventListener('click', (e) => {
  if (e.target.tagName === 'BUTTON' && selectedCell.row !== -1 && selectedCell.col !== -1) {
    // prevent changing the original puzzle
    if (initialPuzzle[selectedCell.row][selectedCell.col] !== 0) {
      return;
    }

    const number = e.target.textContent;

    if (number === 'Clear') {
      puzzle[selectedCell.row][selectedCell.col] = 0;
    } else {
      puzzle[selectedCell.row][selectedCell.col] = parseInt(number);
    }
    redraw();
    updateButtonStates();
  }
});

/**
 * Updates the number pad to disable buttons for numbers that are already
 * used 9 times.
 * @returns {void}
 */
function updateNumberPad() {
  const counts = {};

  for (let r = 0; r < GRID_SIZE; r++) {
    for (let c = 0; c < GRID_SIZE; c++) {
      const num = puzzle[r][c];
      if (num !== 0) {
        counts[num] = (counts[num] || 0) + 1;
      }
    }
  }

  const numberButtons = numberPad.getElementsByTagName('button');

  for (const button of numberButtons) {
    const number = parseInt(button.textContent);
    if (!isNaN(number)) {
      if (counts[number] && counts[number] >= 9) {
        button.disabled = true;
      } else {
        button.disabled = false;
      }
    }
  }
}

/**
 * Checks if the puzzle is empty.
 * @returns {boolean}
 */
function isPuzzleEmpty() {
  for (let r = 0; r < GRID_SIZE; r++) {
    for (let c = 0; c < GRID_SIZE; c++) {
      if (puzzle[r][c] !== 0) {
        return false;
      }
    }
  }
  return true;
}

/**
 * Updates the state of the buttons based on the puzzle state.
 * @returns {void}
 */
function updateButtonStates() {
  const empty = isPuzzleEmpty();
  solveButton.disabled = empty;
  checkPuzzleButton.disabled = empty;
}
