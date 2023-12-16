import React, {useEffect, useState} from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faTrash, faXmark} from '@fortawesome/free-solid-svg-icons';

import InputComponent from "../UI/InputComponent";

const AddAnswerComponent = ({ index, title, mark, onUpdateAnswer, onRemoveAnswer }) => {
    const [answerTitle, setAnswerTitle] = useState(title);
    const [answerMark, setAnswerMark] = useState(mark);

    useEffect(() => {
        updateAnswerInfo();
    }, [answerTitle, answerMark]);

    const updateAnswerTitle = (e) => {
        const { value } = e.target;
        setAnswerTitle(value);
    };

    const removeAnswer = () => {
        onRemoveAnswer(index);
    };

    const updateAnswerMark = (e) => {
        const { value } = e.target;
        setAnswerMark(value);
    };

    const updateAnswerInfo = () => {
        onUpdateAnswer(index, answerTitle, answerMark);
    };

    return (
        <div>
            <div className="answer-block-item-fields">
                <input type="text" value={answerTitle} onChange={updateAnswerTitle} className={'input-text'}/>
                <input type="number" value={answerMark} onChange={updateAnswerMark} className={'input-number'}/>
                <button className={'btn btn-danger btn-remove'} onClick={removeAnswer}>
                    <FontAwesomeIcon icon={faXmark} />
                </button>
            </div>
        </div>
    );
};

export default AddAnswerComponent;
