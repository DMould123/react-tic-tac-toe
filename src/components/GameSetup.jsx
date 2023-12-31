import React, { useState, useEffect } from 'react';
import Board from './Board';
import logo from '../img/logo.jpg'


function GameSetup() {
  const [playerMove, setPlayerMove] = useState(true)
  const [history, setHistory] = useState([Array(9).fill(null)])
  const [isGameOver, setIsGameOver] = useState(false)
  const [winningSquares, setWinningSquares] = useState([])
  const [playerNames, setPlayerNames] = useState({ X: '', O: '' })
  const [score, setScore] = useState({ X: 0, O: 0 })
  const [bestOf, setBestOf] = useState(1)
  const [currentGame, setCurrentGame] = useState(1)
  const [setupMode, setSetupMode] = useState(true)
  const [gamesPlayed, setGamesPlayed] = useState(0)

  const currentSquares = history[history.length - 1]

  useEffect(() => {
    const winner = calculateWinner(currentSquares);
    if (winner) {
      setWinningSquares(getWinningSquares(currentSquares, winner));
      setScore((prevScore) => ({
        ...prevScore,
        [winner]: prevScore[winner] + 1
      }));
      setIsGameOver(true);
    } else if (history.length === 10) {
      setIsGameOver(true);
    }

    setGamesPlayed((prevGamesPlayed) => prevGamesPlayed + 1);
  }, [currentSquares, history]);


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
        break
      }
    }
    return winningSquares
  }

  function handlePlay(nextSquares) {
    setHistory([...history, nextSquares])
    setPlayerMove(!playerMove)
  }

  function startNewGame() {
    if (setupMode) {
      if (playerNames.X && playerNames.O && bestOf >= 1) {
        setSetupMode(false);
        setGamesPlayed(0);
        setScore({ X: 0, O: 0 });
        setHistory([Array(9).fill(null)]);
        setIsGameOver(false);
        setWinningSquares([]);
      } else {
        alert('Please fill in player names and select a valid "best of" value.');
      }
    } else {
      const newGame = currentGame + 1;
      setCurrentGame(newGame);
      if (score.X < Math.ceil(bestOf / 2) && score.O < Math.ceil(bestOf / 2)) {
        setIsGameOver(false);
        setWinningSquares([]);
        setHistory([Array(9).fill(null)]);
        setPlayerMove(newGame % 2 === 0);
      } else {
        let seriesResult = '';
        let seriesScore = `${score.X}-${score.O}`;

        if (score.X > score.O) {
          seriesResult = `${playerNames.X} won the series with a score of ${seriesScore}`;
        } else if (score.O > score.X) {
          seriesResult = `${playerNames.O} won the series with a score of ${seriesScore}`;
        } else {
          seriesResult = `The series ended in a draw with a score of ${seriesScore}`;
        }
        alert(`GAME OVER! ${seriesResult}`);

        // Reset for the next series
        setCurrentGame(1);
        setScore({ X: 0, O: 0 });
        setSetupMode(true);
        setGamesPlayed(0);
        setPlayerNames({ X: '', O: '' }); // Reset player names
      }
    }
  }


  const onSquareClick = (i) => {
    if (!setupMode && !isGameOver && !currentSquares[i]) {
      handlePlay(
        currentSquares.map((square, index) =>
          index === i ? (playerMove ? 'X' : 'O') : square
        )
      )
    }
  }

  return (
    <div className="custom-game">
      {setupMode ? (
        <div className="setup-container">
                    <img src={logo} alt="Logo" className="custom-logo" />
          <h2>Setup the Game</h2>
          <label>
            Enter the name for Player X:
            <input
              type="text"
              value={playerNames.X}
              onChange={(e) =>
                setPlayerNames({ ...playerNames, X: e.target.value })
              }
            />
          </label>
          <br />
          <label>
            Enter the name for Player O:
            <input
              type="text"
              value={playerNames.O}
              onChange={(e) =>
                setPlayerNames({ ...playerNames, O: e.target.value })
              }
            />
          </label>
          <br />
          <label>
            Best of games:
            <select
              value={bestOf}
              onChange={(e) => {
                setBestOf(parseInt(e.target.value, 10))
                setCurrentGame(1)
                setScore({ X: 0, O: 0 })
                setGamesPlayed(0)
                setHistory([Array(9).fill(null)]) // Clear previous games
              }}
            >
              <option value={1}>1</option>
              <option value={3}>3</option>
              <option value={5}>5</option>
              <option value={7}>7</option>
              <option value={9}>9</option>
            </select>
          </label>
          <br />
          <button onClick={startNewGame}>Start Game</button>
        </div>
      ) : (
        <div className="custom-game-board">
          <img src={logo} alt="Logo" className="custom-logo" /> {/* Logo inside the game board */}
          <Board
            playerMove={playerMove}
            setPlayerMove={setPlayerMove}
            squares={currentSquares}
            onSquareClick={onSquareClick}
            isGameOver={isGameOver}
            winningSquares={winningSquares}
            startNewGame={startNewGame}
          />
          {gamesPlayed > 0 && (
            <div className="series-results">{`${playerNames.X} ${score.X} ${playerNames.O} ${score.O} (Best of ${bestOf})`}</div>
          )}
        </div>
      )}
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

export default GameSetup
