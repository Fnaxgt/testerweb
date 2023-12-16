import React, {useEffect, useRef, useState} from 'react';
import InputComponent from "../Components/UI/InputComponent";
import QuestionComponent from "../Components/QuestionComponent";
import './AddTest.css';
import AddQuestionComponent from "../Components/Add/AddQuestionComponent";
import axios from "axios";

const AddTestPage = () => {
    const [testName, setTestName] = useState('');
    const [testDifficulty, setTestDifficulty] = useState('');
    const [allowComments, setAllowComments] = useState(false);
    const [allowResults, setAllowResults] = useState(false);
    const [testTime, setTestTime] = useState(0);
    const [questions, setQuestions] = useState({});
    const [subjects, setSubjects] = useState([]);


    useEffect(() => {
        axios.get('http://localhost:8081/get/subject')
            .then(response => {
                setSubjects(response.data);
            })
            .catch(error => {
                console.error('Error fetching subjects:', error);
            });
    }, []);

    useEffect(() => {
        const renderComboBox = () => {
            const comboBox = document.getElementById('subjectComboBox');
            comboBox.innerHTML = '';
            subjects.forEach(subject => {
                const option = document.createElement('option');
                option.value = subject.id;
                option.text = subject.title;
                comboBox.add(option);
            });
        }

        renderComboBox();
    }, [subjects]);

    let questionsCount = useRef(0);

    const addQuestionHandler = () => {
        setQuestions(prevState => {
            return {
                ...prevState,
                [Object.keys(prevState).length]: {
                    question: '',
                    answers: []
                }
            }
        });
    };

    const addNewQuestion = (newQuestion) => {
        questionsCount.current++;
        const updatedQuestions = {...questions};
        updatedQuestions[questionsCount.current] = newQuestion;
        setQuestions(updatedQuestions);
    };

    const updateQuestionHandler = (index, question, answers) => {
        const updatedQuestions = {...questions};
        updatedQuestions[index] = {
            question,
            answers
        };
        setQuestions(updatedQuestions);
    }

    const removeQuestionHandler = (indexToRemove) => {
        const updatedQuestions = { ...questions };

        if (updatedQuestions.hasOwnProperty(indexToRemove)) {
            // Remove the specified key representing the question to be deleted
            delete updatedQuestions[indexToRemove];

            // Re-index the remaining questions
            const reIndexedQuestions = {};
            Object.keys(updatedQuestions).forEach((key, index) => {
                reIndexedQuestions[index] = updatedQuestions[key];
            });

            setQuestions(reIndexedQuestions);
        } else {
            console.error('Question index not found.');
        }
    };




    const saveTestHandler = () => {
        axios.post('http://localhost:8081/post/test', {
            title: testName,
            difficult: testDifficulty,
            time: testTime,
            allow_comments: allowComments,
            admin_id : 'admin',
            allow_result: allowResults,
            subject_id : document.getElementById('subjectComboBox').value
        })
            .then(response => {
                console.log('Test data saved:', response.data);
                const testId = response.data.testId;

                Object.keys(questions).forEach(question => {
                    axios.post('http://localhost:8081/post/question', {
                        title: questions[question].question.title,
                        total_mark: questions[question].question.mark,
                        comment: questions[question].question.comment,
                        answertype: 'single',
                        test_id: testId
                    })
                        .then(response => {
                            console.log('Question data saved:', response.data);
                            const questionId = response.data.questionId;

                            questions[question].answers.forEach(answer => {
                                axios.post('http://localhost:8081/post/answer', {
                                    title: answer.title,
                                    answer_mark: answer.mark,
                                    question_id: questionId
                                })
                                    .then(response => {
                                        console.log('Answer data saved:', response.data);
                                    })
                                    .catch(error => {
                                        console.error('Error saving answer data:', error);
                                    });
                            });
                        })
                        .catch(error => {
                            console.error('Error saving question data:', error);
                        });
                });
            })
            .catch(error => {
                console.error('Error saving test data:', error);
            });
        window.location.href = '/tests';
    };

    return (
        <div className={'add-test-container'}>
            <input className={'input-text input-test-name'} placeholder={"Введите название теста..."} type="text" value={testName} onChange={e => setTestName(e.target.value)}/>
            <select name="difficult" id="difficultComboBox" onChange={e => setTestDifficulty(e.target.value)}>
                <option value="Легкий">Легкий</option>
                <option value="Средний">Средний</option>
                <option value="Тяжелый">Тяжелый</option>
            </select>
            <select name="subject" id="subjectComboBox">
                <option value="0">Выберите предмет</option>
            </select>
            <div className="checkbox-container">
                <input type="checkbox" id="allowComments" onChange={e => setAllowComments(e.target.checked)}/>
                <label htmlFor="allowComments">Разрешить комментарии</label>
            </div>
            <div className="checkbox-container">
                <input type="checkbox" id="allowResults" onChange={e => setAllowResults(e.target.checked)}/>
                <label htmlFor="allowResults">Разрешить просмотр результатов</label>
            </div>
            <input className={'input-number'} type="number" value={testTime} onChange={e => setTestTime(e.target.value)}/>
            <h1 className={'question-header'}>Список вопросов</h1>
            <hr/>
            <div className="questions-block">
                {Object.keys(questions).map((question, index) => {
                    return (
                        <AddQuestionComponent
                            key={index}
                            number={index + 1}
                            question={questions[question].question}
                            answers={questions[question].answers}
                            onAddQuestion={addNewQuestion}
                            onUpdateQuestion={updateQuestionHandler}
                            onRemoveQuestion={removeQuestionHandler}
                        />
                    );
                })}
                <button className={'btn btn-primary'} onClick={addQuestionHandler}>Добавить вопрос</button>
            </div>
            <hr/>
            <button className="btn btn-success btn-save-test" onClick={saveTestHandler}>Сохранить</button>
        </div>
    );
};

export default AddTestPage;