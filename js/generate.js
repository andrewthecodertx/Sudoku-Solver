/**
 * Generates a Sudoku puzzle.
 * @param {number} difficulty - The number of cells to remove from the solved puzzle.
 * @returns {Array<Array<number>>}
 */
function generateSudoku(difficulty) {
  let puzzle = Array(GRID_SIZE).fill(null).map(() => Array(GRID_SIZE).fill(0));

  puzzle = solveSudoku(puzzle); // start with a solved puzzle

  // remove cells to create the puzzle
  let cellsToRemove = difficulty;

  while (cellsToRemove > 0) {
    const row = Math.floor(Math.random() * GRID_SIZE);
    const col = Math.floor(Math.random() * GRID_SIZE);

    if (puzzle[row][col] !== 0) {
      puzzle[row][col] = 0;
      cellsToRemove--;
    }
  }

  return puzzle;
}
