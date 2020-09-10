import React, {useContext, useEffect, useState} from 'react';
import { Link } from 'react-router-dom';
import './index-page.css';
import {AuthContext} from "../auth-context";
import {useHttp} from "../hooks/http.hook";
import Spinner from "../components/spinner";

const buildItemList = (data) => {
    const items = [];

    for (let i = 0; i < data.length; i++) {
        const date = data[i].state.date;
        items.push(
            <Link key={data[i].id} to={'/create/' + data[i].id}
                  className="m-0 list-group-item list-group-item-action">
                Отчет от { date }
            </Link>
        );
    }

    return items;
};

const IndexPage = () => {
    const auth = useContext(AuthContext);
    const { request } = useHttp();

    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(false);

    const getData = () => {
        request('/api/reports', 'GET', null, { Authorization: auth.token })
            .then(response => {
                setItems(buildItemList(response['reports']));
                setLoading(false);
            });
    };

    useEffect(() => {
        setLoading(true);
        getData();
    }, []);

    return (
        <div className="background d-md-flex justify-content-center align-items-center">
            <div className="index-page p-4 p-md-5 shadow-lg bg-white rounded">

                <h3 className="font-weight-bold text-center mt-4 mt-md-2">Здравствуйте!</h3>

                <div className="mt-5">
                    <p className="text-muted font-weight-light">Ваши отчеты:</p>
                    <div className="mt-3" style={{'overflowY':'scroll', 'overflowX':'hidden', 'maxHeight': 331}}>
                        <li className="list-group">
                            {loading ? <div className='m-4'><Spinner /></div> : items.length > 0 ?
                                items : <p className='alert alert-warning text-center'>Отчетов пока нет</p>}
                        </li>
                    </div>
                </div>

                <div className="mt-4 row">
                    <div className="col-12 col-md mb-2 mb-md-0">
                        <Link className="btn btn-primary btn-block"
                              to="/create">+ Создать отчет</Link>
                    </div>


                    <div className="col-12 col-md">
                        <button className='btn btn-outline-danger btn-block'
                                onClick={() => {
                                    auth.logout()
                                }}>
                            Выйти
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default IndexPage;