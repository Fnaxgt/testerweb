import React, {useEffect, useState} from 'react';
import './TaskBar.css';

const TaskBarComponent = (props) => {
    const [questions, setQuestions] = useState([]);
    const [results, setResults] = useState([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

    useEffect(() => {
        setQuestions(props.questions);
        setResults(props.results);
        setCurrentQuestionIndex(props.currentIndex);
    }, [props.currentIndex]);

    const handleTaskChange = (event) => {
        let questionIndex = parseInt(event.target.value);
        questionIndex--;
        props.onTaskChange(questionIndex);
    };

    const renderTaskBar = () => {
        const taskBar = [];
        for (let i = 0; i < questions.length; i++) {
            const result = results.find(result => result.question_id === questions[i].id);
            let buttonClass = "btn task-button";
            if (result) {
                buttonClass += result.answer_mark === questions[i].total_mark ? " task-button-success" : " task-button-fail";
            }
            if (i === currentQuestionIndex) {
                buttonClass += " task-button-active";
            }
            taskBar.push(
                <div key={i} className={'task-bar-item'}>
                    <button className={buttonClass} value={i + 1} onClick={handleTaskChange}>
                        {i + 1}
                    </button>
                </div>
            );
        }
        return taskBar;
    };

    return (
        <div className={'taskBarContainer'}>
            {renderTaskBar()}
        </div>
    );
};

export default TaskBarComponent;