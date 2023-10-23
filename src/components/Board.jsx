import React from 'react';
import Square from './Spuare';


function Board({
  playerMove,
  setPlayerMove,
  squares,
  onSquareClick,
  isGameOver,
  winningSquares,
  startNewGame
}) {
  const renderSquare = (i) => (
    <Square
      value={squares[i]}
      onSquareClick={() => onSquareClick(i)}
      isWinningSquare={winningSquares.includes(i)}
    />
  )

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
      <div className="custom-status">
        {isGameOver ? 'Game Over' : `Next player: ${playerMove ? 'X' : 'O'}`}
      </div>
      <div className="custom-board-row">{boardRows}</div>
      <div className="custom-status">
        {isGameOver ? (
          <>
            {winningSquares.length === 0 ? (
              <p>It's a draw!</p>
            ) : (
              <p>Winner: {playerMove ? 'O' : 'X'}</p>
            )}
            <button onClick={startNewGame}>New Game</button>
          </>
        ) : null}
      </div>
    </>
  )
}

export default Board;
