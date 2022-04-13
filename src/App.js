import React, {Component, useState} from 'react';
import Header from './pages/Header';
import Feed from './pages/Feed';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import Profile from './pages/Profile';
import Search from './pages/Search';
import User from './pages/User'
import useToken from './lib/api/useToken';
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
                    <Route path="/user/:id" element={<User/>}/>
                </Routes>
            </div>
        </BrowserRouter>
    );
}


export default App;
