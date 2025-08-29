// Mocking the functions from the other files
import { jest } from '@jest/globals';
import { GRID_SIZE } from '../js/constants.js';
import {
  generateSudoku
} from '../js/generate.js';
import {
  solveSudoku,
  isValidSudoku,
  countSolutions
} from '../js/solve.js';

// Mock the shuffle function to make tests deterministic
jest.mock('../js/solve.js', () => ({
  ...jest.requireActual('../js/solve.js'),
  shuffle: jest.fn((array) => array),
}));

describe('Sudoku Logic', () => {
  describe('generateSudoku', () => {
    it('should generate a 9x9 puzzle', () => {
      const puzzle = generateSudoku(40);
      expect(puzzle.length).toBe(GRID_SIZE);
      puzzle.forEach(row => {
        expect(row.length).toBe(GRID_SIZE);
      });
    });

    it('should generate a puzzle with a unique solution', () => {
      const puzzle = generateSudoku(40);
      const puzzleCopy = JSON.parse(JSON.stringify(puzzle)); // Deep copy
      const solutions = countSolutions(puzzleCopy);
      expect(solutions).toBe(1);
    });
  });

  describe('solveSudoku', () => {
    it('should solve a simple puzzle', () => {
      const puzzle = [
        [5, 3, 0, 0, 7, 0, 0, 0, 0],
        [6, 0, 0, 1, 9, 5, 0, 0, 0],
        [0, 9, 8, 0, 0, 0, 0, 6, 0],
        [8, 0, 0, 0, 6, 0, 0, 0, 3],
        [4, 0, 0, 8, 0, 3, 0, 0, 1],
        [7, 0, 0, 0, 2, 0, 0, 0, 6],
        [0, 6, 0, 0, 0, 0, 2, 8, 0],
        [0, 0, 0, 4, 1, 9, 0, 0, 5],
        [0, 0, 0, 0, 8, 0, 0, 7, 9],
      ];
      const solution = solveSudoku(puzzle);
      expect(isValidSudoku(solution)).toBe(true);
    });
  });

  describe('isValidSudoku', () => {
    it('should return true for a valid and complete puzzle', () => {
      const puzzle = [
        [5, 3, 4, 6, 7, 8, 9, 1, 2],
        [6, 7, 2, 1, 9, 5, 3, 4, 8],
        [1, 9, 8, 3, 4, 2, 5, 6, 7],
        [8, 5, 9, 7, 6, 1, 4, 2, 3],
        [4, 2, 6, 8, 5, 3, 7, 9, 1],
        [7, 1, 3, 9, 2, 4, 8, 5, 6],
        [9, 6, 1, 5, 3, 7, 2, 8, 4],
        [2, 8, 7, 4, 1, 9, 6, 3, 5],
        [3, 4, 5, 2, 8, 6, 1, 7, 9],
      ];
      expect(isValidSudoku(puzzle)).toBe(true);
    });

    it('should return false for an incomplete puzzle', () => {
      const puzzle = [
        [5, 3, 0, 0, 7, 0, 0, 0, 0],
        [6, 0, 0, 1, 9, 5, 0, 0, 0],
        [0, 9, 8, 0, 0, 0, 0, 6, 0],
        [8, 0, 0, 0, 6, 0, 0, 0, 3],
        [4, 0, 0, 8, 0, 3, 0, 0, 1],
        [7, 0, 0, 0, 2, 0, 0, 0, 6],
        [0, 6, 0, 0, 0, 0, 2, 8, 0],
        [0, 0, 0, 4, 1, 9, 0, 0, 5],
        [0, 0, 0, 0, 8, 0, 0, 7, 9],
      ];
      expect(isValidSudoku(puzzle)).toBe(false);
    });

    it('should return false for a puzzle with duplicate numbers in a row', () => {
      const puzzle = [
        [5, 3, 4, 6, 7, 8, 9, 1, 5], // Duplicate 5
        [6, 7, 2, 1, 9, 5, 3, 4, 8],
        [1, 9, 8, 3, 4, 2, 5, 6, 7],
        [8, 5, 9, 7, 6, 1, 4, 2, 3],
        [4, 2, 6, 8, 5, 3, 7, 9, 1],
        [7, 1, 3, 9, 2, 4, 8, 5, 6],
        [9, 6, 1, 5, 3, 7, 2, 8, 4],
        [2, 8, 7, 4, 1, 9, 6, 3, 5],
        [3, 4, 5, 2, 8, 6, 1, 7, 9],
      ];
      expect(isValidSudoku(puzzle)).toBe(false);
    });
  });
});
