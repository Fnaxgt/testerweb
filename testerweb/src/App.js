import logo from './logo.svg';
import './App.css';
import HeaderComponent from './Components/HeaderComponent.jsx';
import AboutPage from './Pages/AboutPage.jsx';
import ErrorPage from './Pages/ErrorPage.jsx';
import Layout from './Layouts/Layout.jsx';
// react router dom
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link, Routes
} from "react-router-dom";
import HomePage from "./Pages/HomePage";
import HistoryPage from "./Pages/HistoryPage";
import TestListPage from "./Pages/TestListPage";
import TestDetailsPage from "./Pages/TestDetailsPage";
import TestOngoingPage from "./Pages/TestOngoingPage";
import TestResultUserPage from "./Pages/TestResultUserPage";
import AddTestPage from "./Pages/AddTestPage";

function App() {
  return (
    <div className="App">
        <Routes>
            <Route path={'/'} Component={Layout}>
                <Route path={"/"} Component={HomePage}></Route>
                <Route path={"/about"} Component={AboutPage}></Route>
                <Route path={"/history"} Component={HistoryPage}></Route>
                <Route path={"/tests"} Component={TestListPage}></Route>
                <Route path={"/tests/:id"} Component={TestDetailsPage}></Route>
                <Route path={"/tests/:id/questions"} Component={TestOngoingPage}></Route>
                <Route path={"/tests/:id/result/:aid"} Component={TestResultUserPage}></Route>
                <Route path={"/add"} Component={AddTestPage}></Route>
                <Route path={"*"} Component={ErrorPage}></Route>
            </Route>
        </Routes>
    </div>
  );
}

export default App;
