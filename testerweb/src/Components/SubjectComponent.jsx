import React from 'react';
import {Link, NavLink} from "react-router-dom";

const SubjectComponent = (props) => {
    const containerStyle = {
        backgroundImage: `url(${props.image})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        color: 'white',
        padding: '50px 0px',
        borderRadius: '10px'
    };

    return (
        <div>
            <Link to={`/category/${props.title}`}>
                <h1  style={containerStyle}>{props.title}</h1>
            </Link>
        </div>
    );
};

export default SubjectComponent;