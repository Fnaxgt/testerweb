import React, {useEffect, useState} from 'react';
import axios from 'axios';
import QuestionComponent from '../Components/QuestionComponent';
import {useLocation} from "react-router-dom";

const TestOngoingPage = () => {
    const [test, setTest] = useState({});
    const [questions, setQuestions] = useState([]);
    const [savedAnswers, setSavedAnswers] = useState({});
    const [attempt, setAttempt] = useState({});
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [preloadedData, setPreloadedData] = useState({});
    const [timeRemaining, setTimeRemaining] = useState(0);

    const location = useLocation();
    const attemptId = new URLSearchParams(location.search).get('attemptId');

    const testId = window.location.pathname.split('/')[2];

    useEffect(() => {
        axios.get(`http://localhost:8081/get/test/${testId}`)
            .then(response => {
                setTest(response.data[0]);
                axios.get(`http://localhost:8081/get/test/${testId}/questions`)
                    .then(response => {
                        setQuestions(response.data);
                    })
                    .catch(error => {
                        console.error('Error fetching test info:', error);
                    });
            })
            .catch(error => {
                console.error('Error fetching test info:', error);
            });

        const savedAnswersFromStorage = localStorage.getItem(`test_${testId}_answers`);
        if (savedAnswersFromStorage) {
            setSavedAnswers(JSON.parse(savedAnswersFromStorage));
        }

        const savedTime = localStorage.getItem(`test_${attemptId}_timeRemaining`);
        setTimeRemaining(savedTime ? parseInt(savedTime) : (test.time * 60));

        axios.get(`http://localhost:8081/get/test/${testId}/questions`)
            .then(response => {
                const preloadedQuestions = {};
                Promise.all(
                    response.data.map(question => (
                        axios.get(`http://localhost:8081/get/question/${question.id}/answers/`)
                            .then(answerResponse => {
                                preloadedQuestions[question.id] = {
                                    question: question,
                                    answers: answerResponse.data,
                                };
                            })
                            .catch(error => {
                                console.error(`Error fetching answers for question ${question.id}:`, error);
                            })
                    ))
                ).then(() => {
                    setPreloadedData(preloadedQuestions);
                });
            })
            .catch(error => {
                console.error('Error fetching preloaded questions:', error);
            });

        axios.get(`http://localhost:8081/get/attempt/${attemptId}`)
            .then(response => {
                setAttempt(response.data[0]);
            })
            .catch(error => {
                console.error('Error fetching attempt info:', error);
            });

        const startTimestamp = new Date(attempt.start_date).getTime();
        console.log(startTimestamp)
        const testDuration = test.time * 60 * 1000;
        console.log(testDuration)

        const currentTime = new Date(Date.now()).getTime();
        const elapsedTime = currentTime - startTimestamp;
        const remainingTime = testDuration - elapsedTime;

        setTimeRemaining(Math.max(0, remainingTime / 1000));

        const countdown = setInterval(() => {
            setTimeRemaining(prevTime => {
                if (prevTime <= 0) {
                    clearInterval(countdown);
                    handleTimeUp();
                }
                const newTime = prevTime - 1;
                localStorage.setItem(`test_${attemptId}_timeRemaining`, newTime.toString());
                return newTime;
            });
        }, 1000);

        return () => {
            clearInterval(countdown);
        };

    }, [testId, test.time, attemptId, attempt.start_date]);

    const handleTimeUp = () => {

    };

    const updateSaveAnswers = (questionId, answers) => {
        const updatedAnswers = {
            ...savedAnswers,
            [questionId]: answers,
        };
        setSavedAnswers(updatedAnswers);
        localStorage.setItem(`test_${testId}_answers`, JSON.stringify(updatedAnswers));
        console.log('Answers saved:', updatedAnswers);
    };

    const handlePreviousQuestion = () => {

        console.log(questions)
        setCurrentQuestionIndex(prevIndex => Math.max(prevIndex - 1, 0));
    };

    const handleNextQuestion = () => {
        setCurrentQuestionIndex(prevIndex => Math.min(prevIndex + 1, questions.length - 1));
    };

    const currentQuestionId = questions[currentQuestionIndex]?.id || null;
    const currentPreloadedQuestion = preloadedData[currentQuestionId] || {};

    const saveResults = () => {
        questions.forEach(question => {
            const answer = preloadedData[question.id].answers[savedAnswers[question.id]] || [];
            console.log(attemptId);
            console.log(question.id);
            console.log(answer.id);
            axios.post('http://localhost:8081/post/result', {
                attempt_id: attemptId,
                question_id: question.id,
                choosen_answer_id: answer.id,
                is_comment: false,
            })
                .then(response => {
                    console.log('Result saved:', response.data);
                })
                .catch(error => {
                    console.error('Error saving result:', error);
                });
        })
    };

    function handleTestFinish() {
        axios.put(`http://localhost:8081/put/attempt/${attemptId}/finish`)
            .then(response => {
                console.log('Attempt finished:', response.data);
            })
            .catch(error => {
                console.error('Error finishing attempt:', error);
            });

        saveResults();

        localStorage.removeItem(`test_${testId}_answers`);
        localStorage.removeItem(`test_${testId}_timeRemaining`);

        window.location.href = `/tests/${testId}/result/${attemptId}`;
    }

    return (
        <div>
            {!attempt.end_date ? (
                <div>
                    <h1>{test.title}</h1>
                    <h3 className={'timeBlock'}>
                        Осталось времени: {timeRemaining > 0 ?
                        <span>{Math.floor(timeRemaining / 3600)} ч. {Math.floor(timeRemaining % 3600 / 60)} мин. {Math.floor(timeRemaining % 60)} сек.</span> :
                        <span>Время вышло!</span>}
                    </h3>
                    <QuestionComponent
                        key={currentPreloadedQuestion.question?.id}
                        question={currentPreloadedQuestion.question || {}}
                        answers={currentPreloadedQuestion.answers || []}
                        number={currentQuestionIndex + 1}
                        totalCount={questions.length}
                        selectedAnswer={savedAnswers[currentQuestionId]}
                        allowClick={false}
                        onSaveAnswers={updateSaveAnswers}
                    />
                    <div className="buttonsGroup">
                        <button className="btn btn-primary" onClick={handlePreviousQuestion}>
                            Предыдущий
                        </button>
                        <button className="btn btn-danger" onClick={handleTestFinish}>Завершить тест</button>
                        <button className="btn btn-primary" onClick={handleNextQuestion}>
                            Следующий
                        </button>
                    </div>
                </div>
            ) : (
                <h1>Тест завершен</h1>
            )
            }
</div>
)
    ;
};

export default TestOngoingPage;
