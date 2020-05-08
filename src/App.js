import React, {Fragment, useState} from 'react';
import {BrowserRouter, Switch, Route} from "react-router-dom";
import Navbar from "./components/layout/Navbar";
import Users from "./components/users/Users";
import User from "./components/users/User";
import Search from "./components/users/Search";
import About from "./components/pages/About";
import Alert from "./components/layout/Alert";
import axios from 'axios';

import GithubState from "./context/github/GithubState";
import './App.css';


const App = () => {

    const [users, setUsers] = useState([]);
    const [user, setUser] = useState({});
    const [repos, setRepos] = useState([]);
    const [loading, setLoading] = useState(false);
    const [alert, setAlert] = useState(null);

    const github = axios.create({
        baseURL: 'https://api.github.com/',
        //timeout: 1000,
        headers: {Authorization: process.env.REACT_APP_GITHUB_TOKEN}
    });

    // Get single Github user
    const getUser = async (username) => {
        setLoading(true);
        const res = await github.get(`users/${username}`);
        //this.setState({user: res.data, loading: false});
        setUser(res.data);
        setLoading(false);
    }

    // Get users repos
    const getUserRepos = async (username) => {
        setLoading(true);
        const res = await github.get(`users/${username}/repos?per_page=5&sort=created:asc`);
        //this.setState({repos: res.data, loading: false});
        setRepos(res.data);
        setLoading(false);
    }

    //Clear users from state
    const clearUsers = () => {
        setUsers([]);
        setLoading(false);
    }

    //Set Alert
    const showAlert = (msg, type) => {
        setAlert({msg, type});
        setTimeout(() => setAlert(null), 2000);
    };

    return (
        <GithubState>
            <BrowserRouter>
                <div className='App'>
                    <Navbar/>
                    <div className='container'>
                        <Alert alert={alert}/>
                        <Switch>
                            <Route exact path='/' render={props => (
                                <Fragment>
                                    <Search
                                        clearUsers={clearUsers}
                                        showClear={users.length > 0}
                                        setAlert={showAlert}/>
                                </Fragment>
                            )}/>
                            <Route exact path='/about' component={About}/>
                            <Route exact path='/user/:login' render={props => (
                                <User
                                    {...props}
                                    getUser={getUser}
                                    getUserRepos={getUserRepos}
                                    user={user}
                                    repos={repos}
                                    loading={loading}
                                />
                            )}/>
                        </Switch>
                        <Users
                            loading={loading}
                            users={users}/>
                    </div>
                </div>
            </BrowserRouter>
        </GithubState>
    );
}

export default App;