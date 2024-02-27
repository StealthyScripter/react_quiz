import React from 'react'
//types
import  { AnswerObject }  from '../App';
//styles
import {Wrapper, ButtonWrapper } from './QuestionCards.styles';

type Props = {
    question : string;
    answers: string[];
    callback: (e: React.MouseEvent<HTMLButtonElement>) => void;
    userAnswer: AnswerObject | undefined;
    QuestionNr: number;
    totalQuestions: number;


}

const QuestionCards: React.FC<Props> = ({
    question, 
    answers, 
    callback, 
    userAnswer, 
    QuestionNr, 
    totalQuestions
    }) => (
<Wrapper>
    <p className="number">
        Question: {QuestionNr} / {totalQuestions}
    </p>
    <p dangerouslySetInnerHTML={{__html: question }}/>
    <div>
       {answers.map(answers =>(
        <ButtonWrapper 
        key={answers}
        correct = {userAnswer?.correctAnswer === answers}
        userClicked={userAnswer?.answer === answers}
        >
            {/* {!!userAnswer} alternative for converting it to boolean */}
            <button disabled = {userAnswer ? true : false} value={answers} onClick={callback}>
                <span dangerouslySetInnerHTML={{__html: answers }}/>
            </button>
        </ButtonWrapper>
       ))}
    </div>


    </Wrapper>
);

export default QuestionCards
export{};
