/**
 * Generates a Sudoku puzzle with a unique solution.
 * @param {number} cellsToRemove - The number of cells to remove from the solved puzzle.
 * @returns {Array<Array<number>>}
 */
import { GRID_SIZE } from './constants.js';
import { solveSudoku, countSolutions } from './solve.js';
import { shuffle } from './utils.js';

export { generateSudoku };

function generateSudoku(cellsToRemove) {
  // 1. Create a completely solved Sudoku
  let puzzle = Array(GRID_SIZE).fill(null).map(() => Array(GRID_SIZE).fill(0));
  const solution = solveSudoku(puzzle);

  // 2. Create a copy of the solution to be the puzzle
  puzzle = structuredClone(solution);

  // 3. Create a list of all cell coordinates
  const cells = [];
  for (let r = 0; r < GRID_SIZE; r++) {
    for (let c = 0; c < GRID_SIZE; c++) {
      cells.push([r, c]);
    }
  }
  shuffle(cells); // Shuffle the cells to remove them in a random order

  // 4. Remove cells one by one, checking for a unique solution
  let removedCount = 0;
  while (cells.length > 0 && removedCount < cellsToRemove) {
    const [row, col] = cells.pop();
    const temp = puzzle[row][col];
    puzzle[row][col] = 0;

    // Check if the puzzle still has a unique solution
    const puzzleCopy = structuredClone(puzzle);
    const numSolutions = countSolutions(puzzleCopy);

    if (numSolutions !== 1) {
      // If not unique, put the number back
      puzzle[row][col] = temp;
    } else {
      removedCount++;
    }
  }

  return puzzle;
}
