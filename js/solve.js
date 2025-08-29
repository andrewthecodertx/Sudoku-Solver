/**
 * Shuffles an array in place.
 * @param {Array} array - The array to shuffle.
 * @returns {void}
 */
import { shuffle } from './utils.js';

export {
  solveSudoku,
  solve,
  countSolutions,
  findEmpty,
  isValid,
  isValidSudoku
};

/**
 * Solves a Sudoku puzzle.
 * @param {Array<Array<number>>} puzzle - The Sudoku puzzle to solve.
 * @returns {Array<Array<number>>}
 */
function solveSudoku(puzzle) {

  const solvedPuzzle = structuredClone(puzzle);
  if (solve(solvedPuzzle)) {
    return solvedPuzzle;
  }
  return puzzle; // Return original puzzle if no solution is found
}

/**
 * Solves a Sudoku puzzle using backtracking.
 * @param {Array<Array<number>>} puzzle - The Sudoku puzzle to solve.
 * @returns {boolean}
 */
function solve(puzzle) {
  const find = findEmpty(puzzle);

  if (!find) {
    return true;
  }

  const [row, col] = find;
  const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];

  shuffle(numbers);

  for (const num of numbers) {
    if (isValid(puzzle, row, col, num)) {
      puzzle[row][col] = num;

      if (solve(puzzle)) {
        return true;
      }

      puzzle[row][col] = 0;
    }
  }

  return false;
}

/**
 * Counts the number of solutions for a Sudoku puzzle.
 * @param {Array<Array<number>>} puzzle - The Sudoku puzzle.
 * @returns {number}
 */
function countSolutions(puzzle) {
  let count = 0;

  function solveAndCount() {
    const find = findEmpty(puzzle);
    if (!find) {
      count++;
      return;
    }

    const [row, col] = find;
    for (let num = 1; num <= 9; num++) {
      if (isValid(puzzle, row, col, num)) {
        puzzle[row][col] = num;
        solveAndCount();
        puzzle[row][col] = 0; // backtrack
        if (count > 1) {
          return; // exit early if more than one solution is found
        }
      }
    }
  }

  solveAndCount();
  return count;
}

/**
 * Finds an empty cell in the Sudoku puzzle.
 * @param {Array<Array<number>>} puzzle - The Sudoku puzzle.
 * @returns {Array<number>|null}
 */
function findEmpty(puzzle) {
  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      if (puzzle[r][c] === 0) {
        return [r, c];
      }
    }
  }

  return null;
}

/**
 * Checks if a number is valid in a given cell.
 * @param {Array<Array<number>>} puzzle - The Sudoku puzzle.
 * @param {number} row - The row of the cell.
 * @param {number} col - The column of the cell.
 * @param {number} num - The number to check.
 * @returns {boolean}
 */
function isValid(puzzle, row, col, num) {
  for (let x = 0; x < 9; x++) {
    if (puzzle[row][x] === num || puzzle[x][col] === num) {
      return false;
    }
  }

  const startRow = row - (row % 3);
  const startCol = col - (col % 3);

  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      if (puzzle[i + startRow][j + startCol] === num) {
        return false;
      }
    }
  }

  return true;
}

/**
 * Checks if a Sudoku puzzle is valid.
 * @param {Array<Array<number>>} puzzle - The Sudoku puzzle to check.
 * @returns {boolean}
 */
function isValidSudoku(puzzle) {
  // check to see if the puzzle is complete (no empty cells)
  if (findEmpty(puzzle)) {
    return false; // not complete
  }

  const tempPuzzle = structuredClone(puzzle);

  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      const num = tempPuzzle[r][c];
      tempPuzzle[r][c] = 0; // remove the number to check its validity
      if (!isValid(tempPuzzle, r, c, num)) {
        return false;
      }
      tempPuzzle[r][c] = num; // restore the number
    }
  }

  return true;
}
