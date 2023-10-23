import React from 'react';

function Square({ value, onSquareClick, isWinningSquare }) {
  const classNames = `custom-square ${isWinningSquare ? 'winning-square' : ''}`;

  return (
    <button className={classNames} onClick={onSquareClick}>
      {value}
    </button>
  );
}

export default Square;
