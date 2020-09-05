import React from 'react';
import { Link } from 'react-router-dom';
import './index-page.css';

const buildItemList = () => {
    const items = [];

    for (let i = 0; i < localStorage.length; i++) {
        const item = JSON.parse(localStorage.getItem(localStorage.key(i)));
        items.push(
            <Link key={i} to={'/create/' + i}
                  className="m-0 list-group-item list-group-item-action">
                Отчет от { item.date }
            </Link>
        );
    }

    return items;
};

const IndexPage = ({history}) => {
    const items = buildItemList();

    return (
        <div className="background d-flex justify-content-center align-items-center">
            <div className="index-page p-5 shadow-lg bg-white rounded">

                <div className="d-flex align-items-center justify-content-between">
                    <h3 className="font-weight-bold">Здравствуйте!</h3>
                    <Link className="btn btn-primary pl-4 pr-4"
                        to="/create">+ Создать отчет</Link>
                </div>

                <div className="mt-5">
                    <p className="text-center text-muted font-weight-light">Последние отчеты:</p>
                    <div className="mt-3">
                        <li className="list-group">
                            {items.length > 0 ? items :
                                <p className=' text-center text-muted'>Вы пока не создавали отчетов</p>}
                        </li>
                    </div>
                </div>

                <div className="mt-5 text-right">
                    { localStorage.length > 0 ?
                        <button className='btn btn-outline-danger'
                                onClick={() => {
                                    localStorage.clear();
                                    history.push('/');
                                }}>
                            Очистить хранилище
                        </button> : null }
                </div>
            </div>
        </div>
    );
};

export default IndexPage;