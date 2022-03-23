import React, {Component} from 'react';
import axios from "axios";


class SignUp extends Component {
    constructor(props) {
        super(props);
        this.created=true;
        this.state = {
            username: '',
            password: '',
            repeatedPassword: ''
        }
    }

    onSignupClick = () => {
        const userData = {
            username: this.state.username,
            password: this.state.password
        };
        axios.post(`api/signup/`, userData)
                .then((result) => {
                    console.log(result.data);
                    alert("Account created successfully!");
                })
                .catch((error) => {
                    this.created = false;
                    console.log(error.response);
                    alert("Try again, there are some problems!");
            });
    };

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

    onRepeatPassword = (e) => {
        this.setState({
            repeatedPassword: e.target.value
        });
    }

    validateForm() {
        let valid = true;
        let feedback = 'You are welcome!';

        if (this.state.password.length === 0) {
            return {
                feedback: 'Please, enter the password',
                valid: false
            }
        }

        if (this.state.password.length < 5) {
            return {
                feedback: 'Password should be longer',
                valid: false
            }
        }

        if (this.state.password !== this.state.repeatedPassword) {
            return {
                feedback: 'Passwords are not equal',
                valid: false
            }
        }

        return {
            feedback: 'You are welcome!',
            valid: true
        }
    }

    handleSubmit = (e) => {
        e.preventDefault();
        console.log(`Form submitted`);
    }

    render() {
        let {feedback, valid} = this.validateForm();
        return (
            <div className="container-sm">
                <ul className="nav nav-tabs">
                    <li className="nav-item">
                        <a className="nav-link" data-bs-toggle="tab" href="signin">Sign in</a>
                    </li>
                    <li className="nav-item">
                        <a className="nav-link  active" data-bs-toggle="tab" href="signup">Sign up</a>
                    </li>
                </ul>

                <h1>Sign up to New Instagram</h1>
                <form method="post" onSubmit={e => this.props.handle_signup(e, this.state)}>
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
                        <div className="form-group">
                            <fieldset>
                                <label className="form-label mt-4">Confirm password</label>
                                <input className="form-control" type="password" placeholder="Password"
                                       required="required" onChange={this.onRepeatPassword}
                                       value={this.state.repeatedPassword}/>
                            </fieldset>
                        </div>

                        {valid &&
                            <div className="alert alert-success" role="alert">
                                {feedback}
                            </div>
                        }

                        {!valid &&
                            <div className="alert alert-danger" role="alert">
                                {feedback}
                            </div>
                        }

                        <br></br>
                        <button type="submit" onClick={this.onSignupClick} disabled={valid ? false : true} className="btn btn-outline-dark">Let me in</button>
                    </fieldset>
                </form>
            </div>
        );
    }
}


export default SignUp;
