import React  from 'react';
import { Difficulty, QuestionType} from '../App';
import './QuestionSelector.css'; // Custom CSS file

type Props = {
  category: string;
  categories: { id: number; name: string }[];
  setCategory: (category: string) => void;
  questionAmount: number;
  setQuestionAmount: (amount: number) => void;
  difficulty: Difficulty;
  setDifficulty: (difficulty: Difficulty) => void;
  questionType: QuestionType;
  setQuestionType: (type: QuestionType) => void;
  startQuiz: () => void;
  loading:boolean;
};

const QuestionSelector: React.FC<Props> = ({
  category,
  categories,
  setCategory,
  questionAmount,
  setQuestionAmount,
  difficulty,
  setDifficulty,
  questionType,
  setQuestionType,
  startQuiz,
  loading
}) => {
  return (
    <div className="question-selector-container">
      <div className="form-group">
        <label>Select Category:
        <select className="styled-select" value={category} onChange={(e) => setCategory(e.target.value)}>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
        </label>
      </div>
      
      <div className="form-group">
        <label>Number of Questions:
        <input
          className="styled-input"
          type="number"
          min="1"
          max="50"
          value={questionAmount}
          onChange={(e) => setQuestionAmount(Number(e.target.value))}
        />
        </label>
      </div>

      <div className="form-group">
        <label>Select Difficulty:
        <select className="styled-select" value={difficulty} onChange={(e) => setDifficulty(e.target.value as Difficulty)}>
          <option value={Difficulty.EASY}>Easy</option>
          <option value={Difficulty.MEDIUM}>Medium</option>
          <option value={Difficulty.HARD}>Hard</option>
        </select>
        </label>
      </div>

      <div className="form-group">
        <label>Select Question Type:
        <select className="styled-select" value={questionType} onChange={(e) => setQuestionType(e.target.value as QuestionType)}>
          <option value={QuestionType.MULTIPLE}>Multiple Choice</option>
          <option value={QuestionType.BOOLEAN}>True/False</option>
        </select>
        </label>
      </div>

      <button className="styled-button" onClick={startQuiz} disabled={loading}>
        {loading ? 'Loading' : 'Start Quiz'}</button>
    </div>
  );
};

export default QuestionSelector;
