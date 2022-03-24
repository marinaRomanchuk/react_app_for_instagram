import React, {Component, useState} from 'react';
import Header from './components/Header';
import Feed from './components/Feed';
import SignIn from './components/SignIn';
import SignUp from './components/SignUp';
import Profile from './components/Profile';
import Search from './components/Search';
import useToken from './components/useToken';
import {BrowserRouter, Route, Routes} from 'react-router-dom';
import "./bootstrap.css";


function App() {
    const { token, setToken } = useToken();

    return (
        <BrowserRouter>
            <div className="App">
                <Header/>
                <Routes>
                    <Route path="/feed" element={<Feed/>}/>
                    <Route path="/profile" element={<Profile/>}/>
                    <Route path="/signin" element={<SignIn setToken={setToken}/>}/>
                    <Route path="/signup" element={<SignUp/>}/>
                    <Route path="/search" element={<Search/>}/>
                </Routes>
            </div>
        </BrowserRouter>
    );
}


export default App;
