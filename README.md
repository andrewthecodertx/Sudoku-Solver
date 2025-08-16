# Sudoku Solver

This is a simple Sudoku solver that can solve any valid Sudoku puzzle. It can also generate new puzzles of varying difficulty.

## Features

*   Solve any valid Sudoku puzzle
*   Generate new puzzles
*   Check if a puzzle is valid
*   Clear the puzzle
*   Responsive design

## How to use

1.  Open `index.html` in your browser.
2.  Click the "Generate Puzzle" button to generate a new puzzle.
3.  Click on a square to select it, then type a number to fill it in.
4.  Click the "Solve Puzzle" button to see the solution.
5.  Click the "Clear Puzzle" button to clear the puzzle.
6.  Click the "Check Puzzle" button to check if the puzzle is valid.

## How it works

The solver uses a backtracking algorithm to find the solution to the puzzle. The generator creates a new puzzle by first generating a complete, valid Sudoku puzzle, and then removing a random number of cells to create an incomplete puzzle.