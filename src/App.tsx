import React, { useState } from 'react';
import { fetchQuizQuestions} from './API';
//components
import QuestionCards from './Components/QuestionCards';
//types
import { QuestionState, Difficulty} from './API';
//styles
import { GlobalStyle, Wrapper } from './App.styles';

export type AnswerObject = {
    question: string;
    answer: string;
    correct: boolean;
    correctAnswer: string;
};

const TOTAL_QUESTIONS = 10;

const App = ()  => {

  const [loading, setLoading]=useState(false);
  const [questions, setquestions]=useState<QuestionState[]>([]);
  const [number, setNumber] = useState(0);
  const [userAnswers, setUserAnswers] = useState<AnswerObject[]>([]);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(true);


  const startTrivia = async () => {
    setLoading(true);
    setGameOver(false);

    const newQuestion = await fetchQuizQuestions(
      TOTAL_QUESTIONS,
      Difficulty.EASY
    );

    setquestions(newQuestion);
    setScore(0);
    setUserAnswers([]);
    setNumber(0);
    setLoading(false);

  };

  const checkAnswer = (e: React.MouseEvent<HTMLButtonElement>) => {
      if (!gameOver) {
        //user anwer
        const answer = e.currentTarget.value;
        //check answer against correct answer
        const correct = questions[number].correct_answer === answer;
        //add score if correct
        if (correct) setScore(prev => prev + 1 );
        //save answer in array of user answers
        const answerObject = {
          question: questions[number].question,
          answer,
          correct,
          correctAnswer: questions[number].correct_answer,
        };
        setUserAnswers(prev => [...prev, answerObject ])
      }
  }

  const nextQuestion = () => {
    //move on to the next question if not the last
    const nextQuestion = number + 1;

    if (nextQuestion === TOTAL_QUESTIONS) {
      setGameOver(true);
    } else {
      setNumber(nextQuestion);
    }
  }

  return (
    <>
    <GlobalStyle />
    <Wrapper>
    <h1>React Quiz </h1>
    {gameOver || userAnswers.length === TOTAL_QUESTIONS ? (
    <button className="start" onClick={startTrivia}>
    Start
    </button>
    ) : null}
    {!gameOver ? <p className="score"> Score: {score}</p> : null}
   {loading && <p>Loading Questions ...</p>}
    
    {!loading && !gameOver && (
    <QuestionCards 
        QuestionNr={number + 1}
        totalQuestions ={TOTAL_QUESTIONS}
        question = {questions[number].question}
        answers={questions[number].answers}
        userAnswer = {userAnswers ? userAnswers[number] : undefined}
        callback = {checkAnswer}
    />
    )}

    {!gameOver && !loading && userAnswers.length === number + 1 && number !== TOTAL_QUESTIONS - 1 ? ( 
    <button className="Next" onClick={nextQuestion}>
    Next Question
    </button>
    ) : null }
     </Wrapper>
     </>
  );
}

export default App;
