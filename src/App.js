import React, { useState, useEffect } from 'react'
import './App.css'
import logo from './logo.jpg' // Assuming the logo is in the same directory as your components

function Square({ value, onSquareClick }) {
  return (
    <button className="custom-square" onClick={onSquareClick}>
      {value}
    </button>
  )
}

function Board({
  playerMove,
  setPlayerMove,
  squares,
  onPlay,
  isGameOver,
  winningSquares,
  onSquareClick,
  startNewGame // Pass the startNewGame function as a prop
}) {
  const renderSquare = (i) => (
    <Square value={squares[i]} onSquareClick={() => onSquareClick(i)} />
  )

  return (
    <>
      <img src={logo} alt="Logo" className="custom-logo" />
      <div className="custom-status">
        {isGameOver ? 'Game Over' : `Next player: ${playerMove ? 'X' : 'O'}`}
      </div>
      <div className="custom-board-row">
        {Array(3)
          .fill(null)
          .map((_, row) => (
            <div key={row} className="board-row">
              {Array(3)
                .fill(null)
                .map((_, col) => (
                  <span key={col}>{renderSquare(row * 3 + col)}</span>
                ))}
            </div>
          ))}
      </div>
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

function Game() {
  const [playerMove, setPlayerMove] = useState(true)
  const [history, setHistory] = useState([Array(9).fill(null)])
  const [isGameOver, setIsGameOver] = useState(false)
  const [winningSquares, setWinningSquares] = useState([])
  const currentSquares = history[history.length - 1]

  useEffect(() => {
    const winner = calculateWinner(currentSquares)
    if (winner) {
      setWinningSquares(winner)
      setIsGameOver(true)
    } else if (history.length === 10) {
      setIsGameOver(true)
    }
  }, [currentSquares, history])

  function handlePlay(nextSquares) {
    setHistory([...history, nextSquares])
    setPlayerMove(!playerMove)
  }

  function startNewGame() {
    setHistory([Array(9).fill(null)])
    setPlayerMove(true)
    setIsGameOver(false)
    setWinningSquares([])
  }

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
          startNewGame={startNewGame} // Pass startNewGame as a prop
        />
      </div>
      <div className="custom-game-info">
        <ol>{/*TODO*/}</ol>
      </div>
    </div>
  )
}

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
