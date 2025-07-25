const canvas = document.getElementById('grid');
const ctx = canvas.getContext('2d');
const solveButton = document.getElementById('solve');

const gridSize = 9;
let cellSize;
let puzzle = Array(gridSize).fill(null).map(() => Array(gridSize).fill(0));
let selectedCell = { row: -1, col: -1 };

function resizeCanvas() {
  const size = Math.min(window.innerWidth * 0.9, window.innerHeight * 0.7);
  canvas.width = size;
  canvas.height = size;
  cellSize = canvas.width / gridSize;
  redraw();
}


function drawGrid() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.strokeStyle = '#000';
  ctx.lineWidth = 1;

  for (let i = 0; i <= gridSize; i++) {
    // Draw thin lines
    ctx.beginPath();
    ctx.moveTo(i * cellSize, 0);
    ctx.lineTo(i * cellSize, canvas.height);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(0, i * cellSize);
    ctx.lineTo(canvas.width, i * cellSize);
    ctx.stroke();
  }

  // Draw thick lines
  ctx.lineWidth = 3;
  for (let i = 0; i <= gridSize; i++) {
    if (i % 3 === 0) {
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

function drawNumbers() {
  ctx.fillStyle = '#000';
  ctx.font = `${cellSize * 0.6}px sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  for (let row = 0; row < gridSize; row++) {
    for (let col = 0; col < gridSize; col++) {
      const num = puzzle[row][col];
      if (num !== 0) {
        ctx.fillText(num, col * cellSize + cellSize / 2, row * cellSize + cellSize / 2);
      }
    }
  }
}

function highlightSelectedCell() {
  if (selectedCell.row !== -1 && selectedCell.col !== -1) {
    ctx.fillStyle = 'rgba(144, 238, 144, 0.5)'; // Light green with transparency
    ctx.fillRect(selectedCell.col * cellSize, selectedCell.row * cellSize, cellSize, cellSize);
  }
}

function redraw() {
  drawGrid();
  highlightSelectedCell();
  drawNumbers();
}

canvas.addEventListener('click', (e) => {
  const rect = canvas.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;

  const col = Math.floor(x / cellSize);
  const row = Math.floor(y / cellSize);

  if (col >= 0 && col < gridSize && row >= 0 && row < gridSize) {
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
    if (!isNaN(key) && key >= 1 && key <= 9) {
      puzzle[selectedCell.row][selectedCell.col] = key;
      redraw();
    } else if (e.key === 'Backspace' || e.key === 'Delete') {
      puzzle[selectedCell.row][selectedCell.col] = 0;
      redraw();
    } else {
      e.preventDefault();
      switch (e.key) {
        case 'ArrowUp':
        case 'k':
          selectedCell.row = (selectedCell.row - 1 + gridSize) % gridSize;
          break;
        case 'ArrowDown':
        case 'j':
          selectedCell.row = (selectedCell.row + 1) % gridSize;
          break;
        case 'ArrowLeft':
        case 'h':
          selectedCell.col = (selectedCell.col - 1 + gridSize) % gridSize;
          break;
        case 'ArrowRight':
        case 'l':
          selectedCell.col = (selectedCell.col + 1) % gridSize;
          break;
      }
      redraw();
    }
  }
});

solveButton.addEventListener('click', () => {
  const solvedPuzzle = solveSudoku(puzzle);
  puzzle = solvedPuzzle;
  redraw();
});

const clearPuzzleButton = document.getElementById('clear-puzzle');

clearPuzzleButton.addEventListener('click', () => {
  puzzle = Array(gridSize).fill(null).map(() => Array(gridSize).fill(0));
  redraw();
});

window.addEventListener('resize', resizeCanvas);

// Initial draw
resizeCanvas();

const numberPad = document.getElementById('number-pad');

numberPad.addEventListener('click', (e) => {
  if (e.target.tagName === 'BUTTON' && selectedCell.row !== -1 && selectedCell.col !== -1) {
    const number = e.target.textContent;
    if (number === 'Clear') {
      puzzle[selectedCell.row][selectedCell.col] = 0;
    } else {
      puzzle[selectedCell.row][selectedCell.col] = parseInt(number);
    }
    redraw();
  }
});
