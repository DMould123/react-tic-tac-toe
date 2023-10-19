import React, { useState, useEffect } from 'react'
import './App.css'
import logo from './logo.jpg'

// Square component for individual and winning squares
function Square({ value, onSquareClick, isWinningSquare }) {
  const classNames = `custom-square ${isWinningSquare ? 'winning-square' : ''}`

  return (
    <button className={classNames} onClick={onSquareClick}>
      {value}
    </button>
  )
}

// Board component for the game board
function Board({
  playerMove,
  setPlayerMove,
  squares,
  onPlay,
  isGameOver,
  winningSquares,
  onSquareClick,
  startNewGame
}) {
  const renderSquare = (i) => (
    <Square
      value={squares[i]}
      onSquareClick={() => onSquareClick(i)}
      isWinningSquare={winningSquares.includes(i)} // Check if the square is a winning square
    />
  )

  // Create the board rows and squares dynamically using two loops
  const boardRows = []
  for (let row = 0; row < 3; row++) {
    const squaresInRow = []
    for (let col = 0; col < 3; col++) {
      const squareIndex = row * 3 + col
      squaresInRow.push(<span key={col}>{renderSquare(squareIndex)}</span>)
    }
    boardRows.push(
      <div key={row} className="board-row">
        {squaresInRow}
      </div>
    )
  }

  return (
    <>
      <img src={logo} alt="Logo" className="custom-logo" />
      <div className="custom-status">
        {isGameOver ? 'Game Over' : `Next player: ${playerMove ? 'X' : 'O'}`}
      </div>
      <div className="custom-board-row">{boardRows}</div>
      <div className="custom-status">
        {isGameOver && (
          <>
            {winningSquares.length === 0 ? (
              <p>It's a draw!</p>
            ) : (
              <p>Winner: {playerMove ? 'O' : 'X'}</p>
            )}
            <button
              onClick={(e) => {
                e.preventDefault()
                startNewGame()
              }}
            >
              New Game
            </button>
          </>
        )}
      </div>
    </>
  )
}

// Game component to manage the game logic
function Game() {
  const [playerMove, setPlayerMove] = useState(true)
  const [history, setHistory] = useState([Array(9).fill(null)])
  const [isGameOver, setIsGameOver] = useState(false)
  const [winningSquares, setWinningSquares] = useState([])
  const currentSquares = history[history.length - 1]

  useEffect(() => {
    // Calculate the winner or check for a draw
    const winner = calculateWinner(currentSquares)
    if (winner) {
      setWinningSquares(getWinningSquares(currentSquares, winner))
      setIsGameOver(true)
    } else if (history.length === 10) {
      setIsGameOver(true)
    }
  }, [currentSquares, history])

  // Function to get the array of winning square indices
  function getWinningSquares(squares, winner) {
    const winningSquares = []
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6]
    ]

    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i]
      if (
        squares[a] === winner &&
        squares[b] === winner &&
        squares[c] === winner
      ) {
        winningSquares.push(a, b, c)
        break // Stop checking after finding the winning combination
      }
    }
    return winningSquares
  }

  // Function to handle a player's move
  function handlePlay(nextSquares) {
    setHistory([...history, nextSquares])
    setPlayerMove(!playerMove)
  }

  // Function to start a new game
  function startNewGame() {
    setHistory([Array(9).fill(null)])
    setPlayerMove(true)
    setIsGameOver(false)
    setWinningSquares([])
  }

  // Function to handle a square click
  const onSquareClick = (i) => {
    if (!isGameOver && !currentSquares[i]) {
      handlePlay(
        currentSquares.map((square, index) =>
          index === i ? (playerMove ? 'X' : 'O') : square
        )
      )
    }
  }

  return (
    <div className="custom-game">
      <div className="custom-game-board">
        <Board
          playerMove={playerMove}
          setPlayerMove={setPlayerMove}
          squares={currentSquares}
          onPlay={handlePlay}
          isGameOver={isGameOver}
          winningSquares={winningSquares}
          onSquareClick={onSquareClick}
          startNewGame={startNewGame}
        />
      </div>
    </div>
  )
}

// Function to calculate the winner
function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ]
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i]
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a]
    }
  }
  return null
}

export default Game
