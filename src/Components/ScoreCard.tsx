import React from 'react';

type Props = {
  score: number;
  restartGame: () => void;
};

const ScoreCard: React.FC<Props> = ({ score, restartGame }) => {
  return (
    <div>
      <p>The game is over! Your score: {score}</p>
      <button type="button" onClick={restartGame}>
        Try again
      </button>
    </div>
  );
};

export default ScoreCard;
