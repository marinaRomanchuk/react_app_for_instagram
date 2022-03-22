import React, {Component} from 'react';
import axios from "axios";
import { setAxiosAuthToken, toastOnError } from "../utils/Utils";

class SignIn extends Component {
    constructor(props) {
        super(props);
        this.state = {
            username: '',
            password: ''
        }
    }

    onChangeUsername = (e) => {
        this.setState({
            username: e.target.value
        });
    }

    onChangePassword = (e) => {
        this.setState({
            password: e.target.value
        });
    }

    handleSubmit = (e) => {
        e.preventDefault();
        console.log(`Form submitted`);
    }

    onSigninClick = () => {
        const userData = {
            username: this.state.username,
            password: this.state.password
        };
        axios.post(`http://127.0.0.1:8000/api/token/`, userData)
            .then((result) => {
                const { auth_token } = result.data;
                console.log(result.data);
                setAxiosAuthToken(auth_token);
            })
            .catch((error) => {
                console.log(error.response);
                alert("Unable to sign in");
            });
    };

    render() {
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
                <form method="post" onSubmit = {this.handleSubmit}>
                    <fieldset>
                        <div className="form-group">
                            <fieldset>
                                <label className="form-label mt-4">Enter username</label>
                                <input className="form-control" type="text" placeholder="Username"
                                       required="required" onChange={this.onChangeUsername}
                                       value={this.state.username}/>
                            </fieldset>
                        </div>
                        <div className="form-group">
                            <fieldset>
                                <label className="form-label mt-4">Enter password</label>
                                <input className="form-control" type="password" placeholder="Password"
                                       required="required" onChange={this.onChangePassword}
                                       value={this.state.password}/>
                            </fieldset>
                        </div>
                        <br></br>
                        <button type="submit" onClick={this.onSigninClick} className="btn btn-outline-dark">Let me in</button>
                    </fieldset>
                </form>

            </div>
        );
    }
}

export default SignIn;