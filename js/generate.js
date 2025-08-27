/**
 * Generates a Sudoku puzzle.
 * @param {number} difficulty - The number of cells to remove from the solved puzzle.
 * @returns {Array<Array<number>>}
 */
function generateSudoku(difficulty) {
  let puzzle = Array(9).fill(null).map(() => Array(9).fill(0));

  puzzle = solveSudoku(puzzle); // start with a solved puzzle

  // remove cells to create the puzzle
  let cellsToRemove = difficulty;

  while (cellsToRemove > 0) {
    const row = Math.floor(Math.random() * 9);
    const col = Math.floor(Math.random() * 9);

    if (puzzle[row][col] !== 0) {
      puzzle[row][col] = 0;
      cellsToRemove--;
    }
  }

  return puzzle;
}
