import React, { useState, useEffect } from 'react';
import { fetchQuizQuestions, fetchCategories} from './API';
//components
import QuestionCards from './Components/QuestionCards';
import QuestionSelector from './Components/QuestionSelector';
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

// const TOTAL_QUESTIONS = 10;

const App = ()  => {

  const [loading, setLoading]=useState(false);
  const [questions, setquestions]=useState<QuestionState[]>([]);
  const [number, setNumber] = useState(0);
  const [userAnswers, setUserAnswers] = useState<AnswerObject[]>([]);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(true);
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



  const startTrivia = async () => {
    try {
    setLoading(true);
    setGameOver(false);

    const newQuestion = await fetchQuizQuestions(
    questionAmount,
      difficulty,
      category,
      questionType
    );

    setquestions(newQuestion);
    setScore(0);
    setUserAnswers([]);
    setNumber(0);
    } catch (error) {
    console.error('Error fetching questions:', error);
    } finally {
    setLoading(false);
  }

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
  };

  const nextQuestion = () => {
    //move on to the next question if not the last
    const nextQuestion = number + 1;

    if (nextQuestion === questionAmount) {
      setGameOver(true);
    } else {
      setNumber(nextQuestion);
    }
  };

  return (
        <>
          <GlobalStyle />
          <Wrapper>
            <h1>QuizMe</h1>
            {gameOver || userAnswers.length === questionAmount ? (
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
              />

            // <div>
            // <section className='questionselectors'>
            //   <label>
            //     Category:
            //     <select value={category} onChange={(e) => setCategory(e.target.value)}>
            //       {categories.map((cat) => (
            //         <option key={cat.id} value={cat.id}>
            //           {cat.name}
            //         </option>
            //       ))}
            //     </select>
            //   </label>
            //   <label>
            //     Questions:
            //     <input
            //       type="number"
            //       min="1"
            //       max="50"
            //       value={questionAmount}
            //       onChange={(e) => setQuestionAmount(Number(e.target.value))}
            //     />
            //   </label>
            //   <label>
            //   Difficulty:
            //     <select value={difficulty} onChange={(e) => setDifficulty(e.target.value as Difficulty)}>
            //       <option value={Difficulty.EASY}>Easy</option>
            //       <option value={Difficulty.MEDIUM}>Medium</option>
            //       <option value={Difficulty.HARD}>Hard</option>
            //     </select>
            //   </label>
            //   <label>
            //       Question type
            //       <select value={questionType} onChange={(e) => setQuestionType(e.target.value as QuestionType)}>
            //         <option value={QuestionType.MULTIPLE}>Multiple choice</option>
            //         <option value={QuestionType.BOOLEAN}>True/False</option>
            //       </select>
            //   </label>
            //   </section>
            //   <button className="start" onClick={startTrivia}>
            //     Start
            //   </button>
            // </div>
            ) : null}

        
        {!gameOver ? <p className="score">Score: {score}</p> : null}
        {loading && <p>Loading Questions...</p>}
        
        {!loading && !gameOver && questions.length > 0 && questions[number]? (
          <QuestionCards 
            QuestionNr={number + 1}
            totalQuestions={questionAmount}
            question={questions[number].question}
            answers={questions[number].answers}
            userAnswer={userAnswers ? userAnswers[number] : undefined}
            callback={checkAnswer}
          />
        ): null }
        
        {!gameOver && !loading && userAnswers.length === number + 1 && number !== questionAmount - 1 ? (
          <button className="Next" onClick={nextQuestion}>
            Next Question
          </button>
        ) : null}
      </Wrapper>
    </>
  );
};

export default App;