import React, { useEffect, useState } from 'react';
import './styles/Answer.css';

const AnswerBoxComponent = (props) => {
    const [selectedAnswer, setSelectedAnswer] = useState(props.selectedAnswer);
    const [rows, setRows] = useState([]);

    useEffect(() => {
        setSelectedAnswer(props.selectedAnswer);
        setRows(renderAnswer());
    }, [props.selectedAnswer, props.chosenAnswerId, props.correctAnswerId]);

    const handleAnswer = (event) => {
        setSelectedAnswer(event.target.value);
        props.onAnswerChange(event.target.value);
    };

    const renderAnswer = () => {
        const letters = ['А', 'Б', 'В', 'Г', 'Д'];
        const rows = [];
        let rowLetter = [];
        for (let i = 0; i < props.count; i++) {
            rowLetter.push(letters[i]);
        }

        if (!props.allowClick) {
            rows.push(
                <tr key={0}>
                    {rowLetter.map((letter, index) => (
                        <th key={index}>{letter}</th>
                    ))}
                </tr>
            );
            rows.push(
                <tr key={1}>
                    {rowLetter.map((letter, index) => (
                        <td key={index}>
                            <label>
                                <input
                                    disabled={props.allowClick}
                                    type="radio"
                                    value={index}
                                    name={`a`}
                                    className="q-radio"
                                    onChange={handleAnswer}
                                    onClick={handleAnswer}
                                    checked={index === parseInt(selectedAnswer)}
                                />
                                <span className="marker"></span>
                            </label>
                        </td>
                    ))}
                </tr>
            );
            return rows;
        } else {
            rows.push(
                <tr key={0}>
                    {rowLetter.map((letter, index) => (
                        <th key={index}>{letter}</th>
                    ))}
                </tr>
            );
            rows.push(
                <tr key={1}>
                    {props.answers.map((answer, index) => {
                        let userSelected = props.chosenAnswerId === answer.id;
                        let isCorrect = props.correctAnswerId === answer.id

                        let className = 'marker ';

                        if (userSelected && isCorrect) {
                            className += 'ok otvet';
                        } else if (isCorrect) {
                            className += 'ok';
                        } else if (userSelected && !isCorrect) {
                            className += 'otvet';
                        }
                        return (
                            <td key={index}>
                                <span className={className}></span>
                            </td>
                        );
                    })}
                </tr>
            );
            return rows;
        }
    };

    return (
        <div className="answer-box">
            <table className="select-answers-variants">
                <tbody>{rows}</tbody>
            </table>
        </div>
    );
};

export default AnswerBoxComponent;
