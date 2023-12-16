import React, {useEffect, useState} from 'react';
import axios from "axios";
import './styles/Test.css';
import {Link} from "react-router-dom";

const TestComponent = (props) => {
    const [test, setTest] = useState([]);
    const [backImage, setBackImage] = useState('');
    const [createdby, setCreatedby] = useState('');
    useEffect(() => {
        setTest(props.test);

        if (props.test.subject_id) {
            axios.get(`http://localhost:8081/get/subject/${props.test.subject_id}`)
                .then(response => {
                    let img = response.data[0].image;
                    setBackImage(`url(${img})`);
                })
                .catch(error => {
                    console.error('Error fetching subject info:', error);
                });
        }
    }, [props.test.subject_id]);

    if(props.test.admin_id){
        axios.get(`http://localhost:8081/get/admin/${props.test.admin_id}`)
            .then(response => {
                console.log(props.test.admin_id);
                let admin = response.data[0].firstname + " " + response.data[0].lastname;
                setCreatedby(admin);
            })
            .catch(error => {
                console.error('Error fetching user info:', error);
            });
    }

    let shortDate = new Date(test.create_date)
    shortDate = shortDate.toLocaleDateString();

    let difficultColor = '';

    switch (test.difficult) {
        case 'Легкий':
            difficultColor = 'green';
            break;
        case 'Средний':
            difficultColor = 'orange';
            break;
        case 'Тяжелый':
            difficultColor = 'red';
            break;
        default:
            difficultColor = 'white';
    }

    return (
        <div className={'testContainer'}>
            <div className="testHeader" style={{ backgroundImage: backImage }}>
                <h1>{test.title}</h1>
                <h3 style={{ color: difficultColor }}>{test.difficult}</h3>
            </div>
            <div className="testBody"></div>
            <div className="testFooter">
                <h3>Автор: <span>{createdby}</span></h3>
                <h3>Дата создания: <span>{shortDate}</span></h3>
            </div>
            <div className="testButtons">
                <Link to={`/tests/${props.test.id}`}><button className={"btn btn-primary"}>Проба теста</button></Link>
            </div>
        </div>
    );
};

export default TestComponent;