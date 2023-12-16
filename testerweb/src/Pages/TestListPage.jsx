import React, {useEffect, useState} from 'react';
import axios from "axios";
import TestComponent from "../Components/TestComponent";

const TestListPage = () => {
    const [tests, setTests] = useState([]);

    useEffect(() => {
        axios.get('http://localhost:8081/get/test')
            .then(response => setTests(response.data))
            .catch(error => console.log(error));
    }, []);
    return (
        <div>
            <h1>Доступно для прохождения:</h1>
            <div>
                {tests.map((test, index) => <TestComponent key={index} test={test}/>)}
            </div>
        </div>
    );
};

export default TestListPage;