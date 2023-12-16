import React, {useEffect, useState} from "react";
import CompletedTestComponent from "../Components/CompletedTestComponent";
import axios from "axios";

function HistoryPage() {
    const [attempts, setAttempts] = useState([]);
    const [tests, setTests] = useState([]);

    useEffect(() => {
        axios.get('http://localhost:8081/get/attempt')
            .then(response => {
                setAttempts(response.data);
                console.log(response.data)
            })
            .catch(error => {
                console.error('Error fetching attempts:', error);
            });
    }, []);

    return (
        <div style={{width: '70%', margin: '10px auto'}}>
            <h1>История результатов</h1>
            {attempts.length > 0 ? (
                attempts.map((attempt, index) => <CompletedTestComponent key={index} attempt={attempt}/>)
            ) : (
                <h2>Вы еще не проходили тесты</h2>
            )}
        </div>
    )
}

export default HistoryPage;