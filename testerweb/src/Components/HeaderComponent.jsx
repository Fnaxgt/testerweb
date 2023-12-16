import React from "react";
import {NavLink} from "react-router-dom";

const HeaderComponent = () => {
    return (
        <header>
            <h1>skILL TEST</h1>
            <nav>
                <NavLink to="/">Главная</NavLink>
                <NavLink to="/about">О нас</NavLink>
                <NavLink to="/history">История</NavLink>
                <NavLink to="/tests">Тесты</NavLink>
                <NavLink to={"/add"}>Новый тест</NavLink>
            </nav>
        </header>
    )
}

export default HeaderComponent;
