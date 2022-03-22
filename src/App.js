import React, {Component} from 'react';
import Header from './components/Header';
import Feed from './components/Feed';
import SignIn from './components/SignIn';
import SignUp from './components/SignUp';
import Profile from './components/Profile';
import Search from './components/Search';
import {BrowserRouter, BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import "./bootstrap.css";
import { ToastContainer } from "react-toastify";
import axios from "axios";
axios.defaults.baseURL = "http://127.0.0.1:8000";

function App() {
    return (
        <BrowserRouter>
            <div className="App">
                <Header/>
                    <Routes>
                        <Route path="/feed" element={<Feed />} />
                        <Route path="/profile" element={<Profile />} />
                        <Route path="/signin" element={<SignIn />} />
                        <Route path="/signup" element={<SignUp />} />
                        <Route path="/search" element={<Search />} />
                    </Routes>
            </div>
        </BrowserRouter>
    );
}

export default App;