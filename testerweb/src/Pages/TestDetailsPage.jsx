import React, {useEffect, useState} from 'react';
import axios from "axios";
import './TestDetails.css';
const TestDetailsPage = () => {
    const [test, setTest] = useState([]);
    const [admin, setAdmin] = useState([]);

    const testId = window.location.pathname.split('/')[2];

    useEffect(() => {
        axios.get(`http://localhost:8081/get/test/${testId}`)
            .then(response => {
                setTest(response.data[0]);
                axios.get(`http://localhost:8081/get/admin/${response.data[0].admin_id}`)
                    .then(response => {
                        setAdmin(response.data[0]);
                    }).catch(error => {
                    console.error('Error fetching admin info:', error);
                });
            })
            .catch(error => {
            console.error('Error fetching test info:', error);
        });
    }, []);

    function backPageHandler() {
        window.history.back();
    }

    let attemptId = 0;
    function handleStartAttempt() {
        const studentId = 'stud';
        const testId = test.id;

        axios.post('http://localhost:8081/post/attempt', {
            student_id: studentId,
            test_id: testId
        })
            .then(response => {
                attemptId = response.data.attemptId;
                console.log('Attempt data saved:', response.data);

                window.location.href = `/tests/${test.id}/questions?attemptId=${attemptId}`;
            })
            .catch(error => {
                console.error('Error saving attempt data:', error);
            });
    }

    return (
        <div>
            <h1>{test.title}</h1>
            <h3 className={'timeBlock'}>Время для прохождения: {test.time ? <span>{test.time} мин.</span> : <span>Неограничено</span>}</h3>
            <h4 className={'authorBlock'}>Автор: {admin ? <span>{admin.firstname} {admin.lastname}</span> : null}</h4>
            <p>{test.description}</p>
            <div className="allowBlock">
                <h2>Настройки теста</h2>
                <hr/>
                <h3>Разрешен просмотр комментариев во время прохождения: <span>{test.allow_comments ? 'Да' : 'Нет'}</span></h3>
                <h3>Разрешен просмотр ответов после прохождения: <span>{test.allow_results ? 'Да' : 'Нет'}</span></h3>
            </div>
            <div className="buttonBlock">
                <button className={'btn btn-primary'} onClick={handleStartAttempt}>Начать тест</button>
                <button className={'btn btn-danger'} onClick={backPageHandler}>Назад</button>
            </div>
        </div>
    );
};

export default TestDetailsPage;