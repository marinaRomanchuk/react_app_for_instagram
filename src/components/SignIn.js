import React, {Component, useState} from 'react';
import axios from "axios";
import PropTypes from 'prop-types';
import {TOKEN_API} from './PathList';

async function loginUser(credentials) {
    return axios.post(TOKEN_API, credentials)
        .then(result => result.data)
        .catch((error) => {
            console.log(error.response);
        });
}

export default function SignIn({ setToken }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = async e => {
        e.preventDefault();
        const token = await loginUser({
            username,
            password
        });
        if (!token) {
            alert("Try again, there are some problems!");
        }
        else {
            console.log(token);
            setToken(token);
            window.location.href = "/";
        }
    }

    return (
        <div className="container-sm">
            <ul className="nav nav-tabs">
                <li className="nav-item">
                    <a className="nav-link active" data-bs-toggle="tab" href="signin">Sign in</a>
                </li>
                <li className="nav-item">
                    <a className="nav-link" data-bs-toggle="tab" href="signup">Sign up</a>
                </li>
            </ul>

            <h1>Sign in to New Instagram</h1>
            <form method="post" onSubmit={handleSubmit}>
                <fieldset>
                    <div className="form-group">
                        <fieldset>
                            <label className="form-label mt-4">Enter username</label>
                            <input className="form-control" type="text" placeholder="Username"
                                   required="required" onChange={e => setUsername(e.target.value)}
                                   value={username}/>
                        </fieldset>
                    </div>
                    <div className="form-group">
                        <fieldset>
                            <label className="form-label mt-4">Enter password</label>
                            <input className="form-control" type="password" placeholder="Password"
                                   required="required" onChange={e => setPassword(e.target.value)}
                                   value={password}/>
                        </fieldset>
                    </div>
                    <br></br>
                    <button type="submit" className="btn btn-outline-dark">Let me in</button>
                </fieldset>
            </form>

        </div>
    );
}


SignIn.propTypes = {
    setToken: PropTypes.func.isRequired
};
