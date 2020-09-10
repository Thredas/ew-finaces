import React, {useContext, useState} from "react";

import './login-page.css'
import {useHttp} from "../hooks/http.hook";
import {AuthContext} from "../auth-context";

export default function LoginPage () {
    const {request, loading, error, cleanError} = useHttp();

    const [form, setForm] = useState({
        login: '',
        password: ''
    });
    const [message, setMessage] = useState(null);
    const auth = useContext(AuthContext);


    const changeListener = event => {
        setForm({...form, [event.target.name]: event.target.value})
    };

    const loginHandler = async (event) => {
        event.preventDefault();
        setMessage(null);
        cleanError();

        if (form['login'] !== '' && form['password'] !== ''){
            try {
                const data = await request(
                    '/api/auth/login', 'POST',
                    JSON.stringify({...form}),
                    {'Content-Type': 'application/json'});


                auth.login(data['token'], data['user_id'])
            } catch (e) {}

        } else {
            setMessage('Все поля должны быть заполнены.');
        }
    };

    return (
        <div className="login-background d-md-flex justify-content-center align-items-center">
            <div className="index-page p-4 p-md-5 shadow-lg bg-white rounded">
                <div className="mt-4">
                    <h2 className="text-center font-weight-bold mb-5">Авторизация</h2>
                    <form onSubmit={loginHandler}>
                        <label>Логин</label>
                        <input type='login'
                               name='login'
                               onChange={changeListener}
                               value={form['login']}
                               disabled={loading}
                               className='form-control mb-3' />

                        <label>Пароль</label>
                        <input type='password'
                               name='password'
                               onChange={changeListener}
                               value={form['password']}
                               disabled={loading}
                               className='form-control' />

                        {message ? <div className="alert alert-warning mt-4" role="alert">
                            {message}
                        </div> : null}

                        {error ? <div className="alert alert-danger mt-4" role="alert">
                            {error}
                        </div> : null}

                        <div className="mt-4">
                            <button className='btn btn-primary btn-block'
                                    disabled={loading}>
                                Войти
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}