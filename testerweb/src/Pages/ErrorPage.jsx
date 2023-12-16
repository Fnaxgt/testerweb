import React from "react";
import {NavLink} from "react-router-dom";
import '../Components/styles/Error.css';

const ErrorPage = () => {
    return (
        <div>
            <h1>404</h1>
            <h3>Page Not Found</h3>
            <NavLink className={'btn btn-primary'} to="/">Go Home</NavLink>
        </div>
    )
}

export default ErrorPage;