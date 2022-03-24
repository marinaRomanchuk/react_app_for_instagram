import React, {Component} from 'react';
import logo from '../inst_logo.png';
import "bootstrap/dist/css/bootstrap.css";
import "../bootstrap.css";
import useToken from "./useToken";

function Header(props) {
    const { token, setToken } = useToken();

    const logOutClick = async e => {
        localStorage.clear();
    }

    const logged_out_nav = (
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
            <div className="container-fluid">
                <a className="navbar-brand" href="/">
                    <img alt="logo" src={logo} width={50}></img>
                    New Instagram
                </a>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse"
                        data-bs-target="#navbarColor03" aria-controls="navbarColor03"
                        aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>

                <button className="btn btn-outline-dark" type="button" data-bs-toggle="collapse"
                        data-bs-target="#navbarColor03" aria-controls="navbarColor03"
                        aria-expanded="false">
                    <a className="nav-link" href="/signin">Sign in</a>
                </button>
            </div>
        </nav>
    );

    const logged_in_nav = (
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
            <div className="container-fluid">
                <a className="navbar-brand" href="/">
                    <img alt="logo" src={logo} width={50}></img>
                    New Instagram
                </a>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse"
                        data-bs-target="#navbarColor03" aria-controls="navbarColor03"
                        aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div className="collapse navbar-collapse" id="navbarColor03">
                    <ul className="navbar-nav me-auto">
                        <li className="nav-item">
                            <a className="nav-link" href="/profile">My profile</a>
                        </li>

                        <li className="nav-item">
                            <a className="nav-link" href="/feed">Feed</a>
                        </li>

                        <li className="nav-item">
                            <a className="nav-link" href="/search">Search</a>
                        </li>
                    </ul>
                </div>

                <button className="btn btn-outline-dark" type="button" data-bs-toggle="collapse"
                        data-bs-target="#navbarColor03" aria-controls="navbarColor03"
                        aria-expanded="false">
                    <a className="nav-link" onClick={logOutClick} href="/">Log out</a>
                </button>
            </div>
        </nav>
    );

    return <div>{token ? logged_in_nav : logged_out_nav}</div>;

}

export default Header;
