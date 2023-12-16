import React, {useEffect, useState} from 'react';
import axios from "axios";
import AnswerBoxComponent from "./AnswerBoxComponent";
import './styles/Question.css';

const QuestionComponent = (props) => {
    const letters = ['А', 'Б', 'В', 'Г', 'Д'];
    useEffect(() => {
    }, [props.userAnswerId]);
    const handleQuestionAnswer = (selectedAnswer) => {
        props.onSaveAnswers(props.question.id, selectedAnswer);
    };


    return (
        <div className="question-component">
            {props.question ? ( // Check if question exists before rendering its properties
                <>
                    <p className="questionCounter">Вопрос {props.number} из {props.totalCount}</p>
                    <h3>{props.question.title}</h3>
                    <div className="answers">
                        {props.answers.map((answer, index) => (
                            <p key={index}><span>{letters[index]}.</span> {answer.title}</p>
                        ))}
                    </div>
                    <AnswerBoxComponent
                        type={props.question.answertype}
                        count={props.answers.length}
                        selectedAnswer={props.selectedAnswer}
                        allowClick={props.allowClick}
                        correctAnswerId={props.correctAnswerId}
                        chosenAnswerId={props.userAnswerId}
                        answers={props.answers}
                        onAnswerChange={handleQuestionAnswer}
                    />
                </>
            ) : (
                <p>Loading question...</p>
            )}
        </div>
    );
};

export default QuestionComponent;