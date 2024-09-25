import React from 'react';
import '../App.styles'
import './QuestionCards.styles'

type Props = {
  score: number;
  restartGame: () => void;
};

const ScoreCard: React.FC<Props> = ({ score, restartGame }) => {
  return (
    <div className='score-card'>
      <p className='score'> Score: {score}</p>
      <button type="button" onClick={restartGame} className='styled-button'>
        Try again
      </button>
    </div>
  );
};

export default ScoreCard;
