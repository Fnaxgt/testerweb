import React from "react";
import {NavLink, Outlet} from "react-router-dom";
import HeaderComponent from "../Components/HeaderComponent";

const Layout = () => {
    return (
        <div>
            <HeaderComponent/>
            <Outlet/>
        </div>
    )
}

export default Layout;