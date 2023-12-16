import React, {useEffect, useState} from 'react';
import InputComponent from "../UI/InputComponent";
import AddAnswerComponent from "./AddAnswerComponent";
//fontawesome plus
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faPlus, faTrash} from '@fortawesome/free-solid-svg-icons';

const AddQuestionComponent = (props) => {
    const [question, setQuestion] = useState({});
    const [answers, setAnswers] = useState([]);
    const [questionTitle, setQuestionTitle] = useState('');

    useEffect(() => {
        props.onUpdateQuestion(props.number - 1, question, answers);
        if(question.title) {
            setQuestionTitle(question.title);
        }
        else{
            setQuestionTitle(`Вопрос ${props.number}`);
        }
    }, [question, answers]);

    useEffect(() => {
        updateInfo();
    }, [questionTitle, answers]);

    const addAnswerHandler = () => {
        setAnswers(prevAnswers => [...prevAnswers, { title: '', mark: 0 }]);
    };

    const updateAnswerHandler = (index, title, mark) => {
        const updatedAnswers = [...answers];
        updatedAnswers[index] = { title, mark };
        setAnswers(updatedAnswers);
        updateInfo();
    };

    const removeAnswerHandler = (index) => {
        const updatedAnswers = answers.filter((_, i) => i !== index);
        setAnswers(updatedAnswers);
    };

    const updateInfo = () => {
        const value = questionTitle;
        const mark = answers.map(answer => parseInt(answer.mark, 10)).reduce((a, b) => a + b, 0);
        const updateQuestion = {
            title : value,
            mark : mark,
            comment : question.comment
        }
        setQuestion(updateQuestion);
        setQuestionTitle(value);
    };

    const updateComment = e => {
        const { value } = e.target;
        const mark = answers.map(answer => answer.mark).reduce((a, b) => a + b, 0);
        const updateQuestion = {
            title : question.title,
            mark : mark,
            comment : value
        }
        setQuestion(updateQuestion);
    }

    const handleQuestionDelete = () => {
        console.log(props.number - 1);
        props.onRemoveQuestion(props.number - 1);
    };

    return (
        <div className={'question-block-item'}>
            <div className="total-mark">
                {question.mark ? question.mark : 0}
            </div>
            <button className={'btn btn-danger btn-delete'} onClick={handleQuestionDelete}>
                <FontAwesomeIcon icon={faTrash} />
            </button>
            <h1>{questionTitle}</h1>
            <input className={'input-text'} type="text" value={question.title} onChange={e => setQuestionTitle(e.target.value)}/>
            <div className="answers-block">
                {answers.map((answer, index) => (
                    <AddAnswerComponent
                        key={index}
                        index={index}
                        title={answer.title}
                        mark={answer.mark}
                        onUpdateAnswer={updateAnswerHandler}
                        onRemoveAnswer={removeAnswerHandler}
                    />
                ))}
                <button className={'btn btn-primary'} onClick={addAnswerHandler}>
                    <FontAwesomeIcon icon={faPlus} />
                </button>
            </div>
        </div>
    );
};

export default AddQuestionComponent;
