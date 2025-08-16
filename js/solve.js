function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

function solveSudoku(puzzle) {
  const solvedPuzzle = JSON.parse(JSON.stringify(puzzle));
  if (solve(solvedPuzzle)) {
    return solvedPuzzle;
  }
  return puzzle; // Return original puzzle if no solution is found
}

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

function isValidSudoku(puzzle) {
  // Check if the puzzle is complete (no empty cells)
  if (findEmpty(puzzle)) {
    return false; // Puzzle is not complete
  }

  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      if (puzzle[r][c] !== 0) {
        const num = puzzle[r][c];
        puzzle[r][c] = 0; // Temporarily remove the number to check its validity
        if (!isValid(puzzle, r, c, num)) {
          puzzle[r][c] = num; // Restore the number
          return false;
        }
        puzzle[r][c] = num; // Restore the number
      }
    }
  }
  return true;
}
