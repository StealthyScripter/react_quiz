
import { Difficulty, QuestionType } from './App';
import {shuffleArray} from './utils';

export type Question = {
    category: string;
    correct_answer: string;
    difficulty: string;
    incorrect_answers: string[];
    question: string;
    type: string;

}

export type QuestionState = Question & { answers: string[]};

export const fetchQuizQuestions = async (amount: number, difficulty: Difficulty, category: string, questionType: QuestionType) =>{
    //const endpoint = https://opentdb.com/api.php?amount=10&difficulty=easy&type=multiple;
    const endpoint = `https://opentdb.com/api.php?amount=${amount}&difficulty=${difficulty}&category=${category}&type=${questionType}`;
    const data = await (await fetch(endpoint)).json();
    return data.results.map((question: Question ) => (
    {
        ...question,
       answers: shuffleArray([
            ...question.incorrect_answers,
            question.correct_answer,
        ]),
    })) as QuestionState[];

    };

export const fetchCategories = async () => {
    const endpoint = `https://opentdb.com/api_category.php`;
    const data = await (await fetch(endpoint)).json();
    return data.trivia_categories;
    };
      