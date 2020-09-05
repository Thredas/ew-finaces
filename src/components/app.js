import React, { Component } from "react";
import { Router, Route, Switch } from 'react-router-dom';
import { createBrowserHistory } from 'history';

import IndexPage from "./index-page";
import CreateReportPage from "./create-report-page";

export default class App extends Component {
    render() {
        //localStorage.clear();
        const history = createBrowserHistory();

        return (
            <Router history={history}>
                <Switch>
                    <Route path="/" history={history} component={IndexPage} exact />
                    <Route path="/create" component={CreateReportPage} history={history} exact />
                    <Route path="/create/:idx"
                           render={({match, history}) =>
                               <CreateReportPage idx={match.params.idx} history={history}/>} exact />

                    <Route render={() => (
                        <div className="text-center mt-5">
                            <h1>404</h1>
                            <p>Page not found</p>
                        </div>
                    )} />
                </Switch>
            </Router>
        );
    }
}