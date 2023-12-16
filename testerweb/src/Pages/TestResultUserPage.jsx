import React, {useEffect, useState} from 'react';
import axios from "axios";
import TaskBarComponent from "../Components/Results/TaskBarComponent";
import QuestionComponent from "../Components/QuestionComponent";

const TestResultUserPage = () => {
    const [attempt, setAttempt] = useState({});
    const [results, setResults] = useState([]);
    const [questions, setQuestions] = useState([]);
    const [preloadedData, setPreloadedData] = useState({});
    const [test, setTest] = useState({});
    const [correctAnswersCount, setCorrectAnswersCount] = useState(0);
    const [totalAnswersCount, setTotalAnswersCount] = useState(0);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [currentPreloadedQuestion, setCurrentPreloadedQuestion] = useState({});
    const [correctAnswerId, setCorrectAnswerId] = useState(0);
    const [userAnswerId, setUserAnswerId] = useState(0);

    useEffect(() => {
        const calculateTotalAnswers = data => {
            let sum = 0;
            data.forEach(result => {
                sum += result.total_mark;
            });
            return sum;
        };

        const calculateCorrectAnswers = data => {
            let sum = 0;
            data.forEach(result => {
                sum += result.answer_mark;
            });
            return sum;
        };

        const attemptId = window.location.pathname.split('/')[4];
        axios.get(`http://localhost:8081/get/attempt/${attemptId}`)
            .then(response => {
                setAttempt(response.data[0]);
                axios.get(`http://localhost:8081/get/attempt/${attemptId}/results`)
                    .then(response => {
                        setResults(response.data);

                        const correctCount = calculateCorrectAnswers(response.data);
                        setCorrectAnswersCount(correctCount);

                        const totalCount = calculateTotalAnswers(response.data);
                        setTotalAnswersCount(totalCount);
                    })
                    .catch(error => {
                        console.error('Error fetching test info:', error);
                    });
            })
            .catch(error => {
                console.error('Error fetching test info:', error);
            });

        const testId = window.location.pathname.split('/')[2];
        axios.get(`http://localhost:8081/get/test/${testId}`)
            .then(response => {
                setTest(response.data[0]);
            })
            .catch(error => {
                console.error('Error fetching test info:', error);
            });

        axios.get(`http://localhost:8081/get/test/${testId}/questions`)
            .then(response => {
                const preloadedQuestions = {};
                setQuestions(response.data);
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
                    setCurrentPreloadedQuestion(preloadedQuestions[response.data[currentQuestionIndex].id]);

                    let correctAnswerId = 0;

                    const correctAnswer = preloadedQuestions[response.data[currentQuestionIndex].id].answers.find(answer => answer.answer_mark > 0);
                    if (correctAnswer) {
                        correctAnswerId = correctAnswer.id;
                    }

                    const userAnswerId = results[currentQuestionIndex]?.choosen_answer_id || 0;

                    setCorrectAnswerId(correctAnswerId);
                    setUserAnswerId(userAnswerId);
                });
            })
            .catch(error => {
                console.error('Error fetching preloaded questions:', error);
            });
    }, [currentQuestionIndex, results]);


    const handleTaskChanged = (questionIndex) => {
        setCurrentQuestionIndex(questionIndex);
    }

    const handlePreviousQuestion = () => {
        setCurrentQuestionIndex(prevIndex => Math.max(prevIndex - 1, 0));
    };

    const handleNextQuestion = () => {
        setCurrentQuestionIndex(prevIndex => Math.min(prevIndex + 1, questions.length - 1));
    };


    return (
        <div>
            <h1>Результаты выполнения теста</h1>
            <h3>Название теста: {test.title}</h3>
            <h3>Набрано баллов: {correctAnswersCount}/{totalAnswersCount}</h3>
            {questions.length > 0 && results.length > 0 ? (
                    <TaskBarComponent
                        questions={questions}
                        results={results}
                        currentIndex={currentQuestionIndex}
                        onTaskChange={handleTaskChanged}
                    />
                ) : null}
            {questions.length > 0 && results.length > 0 && Object.keys(preloadedData).length > 0 ? (
                <QuestionComponent
                    key={currentPreloadedQuestion.question?.id}
                    question={currentPreloadedQuestion.question || {}}
                    answers={currentPreloadedQuestion.answers || []}
                    number={currentQuestionIndex + 1}
                    totalCount={questions.length}
                    correctAnswerId={correctAnswerId}
                    userAnswerId={userAnswerId}
                    allowClick={true}
                />
            ) : null}
            <div className="buttonsGroup">
                <button className="btn btn-primary" onClick={handlePreviousQuestion}>
                    Предыдущий
                </button>
                <button className="btn btn-primary" onClick={handleNextQuestion}>
                    Следующий
                </button>
            </div>
        </div>
    );
};

export default TestResultUserPage;