/**
 * Shuffles an array in place.
 * @param {Array} array - The array to shuffle.
 * @returns {void}
 */
function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

/**
 * Solves a Sudoku puzzle.
 * @param {Array<Array<number>>} puzzle - The Sudoku puzzle to solve.
 * @returns {Array<Array<number>>}
 */
function solveSudoku(puzzle) {

  const solvedPuzzle = JSON.parse(JSON.stringify(puzzle));
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
  l
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

  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      if (puzzle[r][c] !== 0) {
        const num = puzzle[r][c];
        puzzle[r][c] = 0; // remove the number to check its validity
        if (!isValid(puzzle, r, c, num)) {
          puzzle[r][c] = num; // restore the number
          return false;
        }
        puzzle[r][c] = num; // restore the number
      }
    }
  }

  return true;
}
