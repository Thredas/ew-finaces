import React from 'react';
import {Redirect, Route, Switch} from "react-router-dom";
import IndexPage from "../pages/index-page";
import CreateReportPage from "../pages/create-report-page";
import LoginPage from "../pages/login-page";

const useRoutes = (isLoggedIn, history) => {
    if (isLoggedIn){
        return (
            <Switch>
                <Route path="/" history={history} component={IndexPage} exact />
                <Route path="/create" component={CreateReportPage} history={history} exact />
                <Route path="/create/:idx"
                       render={({match, history}) =>
                           <CreateReportPage idx={match.params.idx} history={history}/>} exact />

                <Redirect to='/' />
            </Switch>
        );
    } else {
        return (
            <Switch>
                <Route path="/" component={LoginPage} history={history} exact />
                <Redirect to='/' />
            </Switch>
        );
    }
};

export default useRoutes;