import React, {useEffect, useState} from 'react';
import './CompletedTest.css';
import {Link} from "react-router-dom";

const CompletedTestComponent = (props) => {
    const[attempt, setAttempt] = useState({});

    useEffect(() => {
        setAttempt(props.attempt);
    }, [props.attempt]);

    const formatDate = (dateString) => {
        if(dateString){
            const options = { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric' };
            return new Date(dateString).toLocaleString(undefined, options);
        }
        else{
            return 'Время не указано';
        }
    };

    return (
        <div className={'history-attempt-block'}>
            {attempt ? (
                <div>
                    <h4>{attempt.title}</h4>
                    <h3>Тест пройден: {formatDate(attempt.end_date)}</h3>
                    <Link to={`/tests/${attempt.test_id}/result/${attempt.id}`}>
                        <button className={'btn btn-primary'}>Просмотреть</button>
                    </Link>
                </div>
            ) : (
                <h2>Вы еще не проходили тесты</h2>
            )}
        </div>
    );
};

export default CompletedTestComponent;