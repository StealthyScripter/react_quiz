import React, { useState, useEffect } from 'react';
import { fetchQuizQuestions, fetchCategories} from './API';
//components
import QuestionCards from './Components/QuestionCards';
import QuestionSelector from './Components/QuestionSelector';
import ScoreCard from './Components/ScoreCard';
//types
import { QuestionState} from './API';
//styles
import { GlobalStyle, Wrapper } from './App.styles';

export type AnswerObject = {
    question: string;
    answer: string;
    correct: boolean;
    correctAnswer: string;
};

export type Category = {
  id: number;
  name: string;
};

export enum Difficulty {
  EASY = 'easy',
  MEDIUM = 'medium',
  HARD = 'hard',
}

export enum QuestionType {
  MULTIPLE = 'multiple',
  BOOLEAN = 'boolean' 
}

export enum GamePhase {
  START= 'start',
  IN_PROGRESS='in_progress',
  END = 'end',
}

const initialState = {
  loading: false,
  questions: [] as QuestionState[],
  userAnswers: [] as AnswerObject[],
  score: 0,
  gamePhase: GamePhase.START,
};

const App = ()  => {

  const [loading, setLoading]=useState(initialState.loading);
  const [questions, setQuestions]=useState(initialState.questions);
  const [number, setNumber] = useState(0);
  const [userAnswers, setUserAnswers] = useState(initialState.userAnswers);
  const [score, setScore] = useState(initialState.score);
  const [gamePhase, setGamePhase] = useState(initialState.gamePhase);
  const [categories, setCategories] = useState<Category[]>([]);
  const [category, setCategory] = useState(''); // Store selected category
  const [questionAmount, setQuestionAmount] = useState<number>(10); // Store selected number of questions
  const [difficulty, setDifficulty] = useState<Difficulty>(Difficulty.EASY);
  const [questionType, setQuestionType] = useState<QuestionType>(QuestionType.MULTIPLE);

  useEffect(() => {
    // Fetch available categories on mount
    const getCategories = async () => {
      const categoryData = await fetchCategories();
      setCategories(categoryData);
    };
    getCategories();
  }, []);

  const [ error, setError] =useState<string | null>(null);

  const startTrivia = async () => {
    try {
    setLoading(true);
    setGamePhase(GamePhase.IN_PROGRESS);

    const newQuestion = await fetchQuizQuestions(
    questionAmount,
      difficulty,
      category,
      questionType
    );

    setQuestions(newQuestion);
    setScore(0);
    setUserAnswers([]);
    setNumber(0);
    setError(null);
    } catch (error) {
    console.error('Error fetching questions:', error);
    setError('Something went wrong. Please try again');
    } finally {
      setLoading(false);
  }

  };

  const checkAnswer = (e: React.MouseEvent<HTMLButtonElement>) => {
      if (gamePhase === GamePhase.IN_PROGRESS) {
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
        setUserAnswers(prev => [...prev, answerObject ]);

        if (number + 1 === questionAmount) {
          setGamePhase(GamePhase.END);
        } else {
          setNumber((prevNumber) => prevNumber + 1);
        }
      }
  };

  const nextQuestion = () => {
    //move on to the next question if not the last
    const nextQuestion = number + 1;

    if (nextQuestion === questionAmount) {
      setGamePhase(GamePhase.END);
      // get data from here to save in a database

    } else {
      setNumber(nextQuestion);
    }
  };

  const resetAllState = () => {
    setLoading(initialState.loading);
    setQuestions(initialState.questions);
    setUserAnswers(initialState.userAnswers);
    setScore(initialState.score);
    setGamePhase(initialState.gamePhase);
  };

  const restartGame = () => {
    resetAllState();
  };

  return (
        <>
          <GlobalStyle />
          <Wrapper>
            <h1>QuizMe</h1>
            {gamePhase === GamePhase.START && (

              <QuestionSelector
                category={category}
                categories={categories}
                setCategory={setCategory}
                questionAmount={questionAmount}
                setQuestionAmount={setQuestionAmount}
                difficulty={difficulty}
                setDifficulty={setDifficulty}
                questionType={questionType}
                setQuestionType={setQuestionType}
                startQuiz={startTrivia}
                loading={loading}
              />
            ) };

        
        {gamePhase === GamePhase.IN_PROGRESS && (
          <>
          <p className="score">Score: {score}</p>
          {error && <p className='error'>{error}</p>}
          {loading && <p>Loading Questions...</p>}
        
        {!loading && questions.length > 0 && questions[number] && (
          <QuestionCards 
            QuestionNr={number + 1}
            totalQuestions={questionAmount}
            question={questions[number].question}
            answers={questions[number].answers}
            userAnswer={userAnswers ? userAnswers[number] : undefined}
            callback={checkAnswer}
          />
        )};
        7
        {!loading && userAnswers.length === number + 1 && number !== questionAmount - 1 ? (
          <button className="Next" onClick={nextQuestion}>
            Next Question
          </button>
        ) : null}
        </>
        )}

        {gamePhase === GamePhase.END && (
          <ScoreCard score={score} restartGame = {restartGame} />
        ) }
      </Wrapper>
    </>
  );
};

export default App;