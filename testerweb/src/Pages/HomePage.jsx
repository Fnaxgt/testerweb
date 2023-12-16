import React, {Component, useEffect, useState} from 'react';
import Subject from '../Models/Subject'
import SubjectComponent from "../Components/SubjectComponent";
import axios from "axios";
import {Link} from "react-router-dom";


const HomePage = () => {
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
    return (
        <div>
            <h1>Добро пожаловать!</h1>
            <h2>Список предметов:</h2>
            <div className="subject-container" style={{width: '75%', margin: '0 auto'}}>
                {subjects.map((subject, index) => <SubjectComponent key={index} title={subject.title} image={subject.image}/>)}
            </div>
            <Link to={'/add'}>
                <button className={'btn btn-primary'}>Добавить новый тест</button>
            </Link>
        </div>
    )
}

export default HomePage;