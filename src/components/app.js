import React from "react";
import { BrowserRouter } from 'react-router-dom';
import { createBrowserHistory } from 'history';
import useRoutes from "./routes";
import {AuthContext} from "../auth-context";
import {useAuth} from "../hooks/auth.hook";

export default function App () {
    const history = createBrowserHistory();
    const {token, userId, login, logout} = useAuth();
    const isLoggedIn = !!token;
    const routes = useRoutes(isLoggedIn, history);

    return (
        <AuthContext.Provider value={{token, login, logout, userId, isLoggedIn}} >
            <BrowserRouter>
                {routes}
            </BrowserRouter>
        </AuthContext.Provider>
    );
};