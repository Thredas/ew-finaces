import React, {useContext, useEffect, useState} from "react";
import Table from "../components/table";
import {useHttp} from "../hooks/http.hook";
import {AuthContext} from "../auth-context";
import Spinner from "../components/spinner";



const getDate = () => {
    const date = new Date();
    return `${date.getDate()}.${date.getMonth()}.${date.getFullYear()}, ${date.getHours()}:${date.getMinutes()}`
};

export default function CreateReportPage({idx, history}) {
    const [state, setState] = useState({
        date: getDate(),
        viruchka: '',
        tableData1: [
            {id: 1, name: 'Фонд дивидентов', percent: 34,
                completed: false, sum: ''},
            {id: 2, name: 'Фонд новых проектов', percent: 3,
                completed: false, sum: ''},
            {id: 3, name: 'Фонд долг. резервов', percent: 2,
                completed: false, sum: ''},
            {id: 4, name: 'Фонд быстрого реагирования', percent: 2,
                completed: false, sum: ''},
            {id: 5, name: 'ФОТ оклад (админ + контент менеджер)', percent: 2,
                completed: false, sum: ''},
            {id: 6, name: 'ФОТ сделка (произвд.отдел)', percent: 27,
                completed: false, sum: ''},
            {id: 7, name: 'ФОТ сделка (административный отдел)', percent: 2,
                completed: false, sum: ''},
            {id: 8, name: 'ФОТ сделка (ФД)', percent: 3,
                completed: false, sum: ''},
            {id: 9, name: 'Фонд обязательств (налог,аренда)', percent: 13,
                completed: false, sum: ''},
        ],
        tableData2: [
            {id: 1, name: 'Продвижение', percent: 30,
                completed: false, sum: ''},
            {id: 2, name: 'Фонд корпоративных расходов', percent: 10,
                completed: false, sum: ''},
            {id: 3, name: 'Фонд игр', percent: 5,
                completed: false, sum: ''},
            {id: 4, name: 'Фонд приобретения оборудования', percent: 10,
                completed: false, sum: ''},
            {id: 5, name: 'Фонд несезона', percent: 22,
                completed: false, sum: ''},
            {id: 6, name: 'Офисные расходы (связь,инет,срм,вода и т.д.)', percent: 18,
                completed: false, sum: ''},
        ],
        tableData3: [],
        marga: 0,
        skd: 0,
        skd_ostatok: 0
    });

    const { request } = useHttp();
    const auth = useContext(AuthContext);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (idx) {
            setLoading(true);

            request(`/api/reports/${idx}`, 'GET', null, { Authorization: auth.token })
                .then(response => {
                    setState(response.state);
                    setLoading(false);
                });
        }
    },[]);

    const getStateTable = (table) => {
        if (table === state.tableData1){
            return 'tableData1';
        } else if ((table === state.tableData2)) {
            return 'tableData2'
        } else {
            return 'tableData3';
        }
    };

    const onSubmit = async (state) => {
        if(idx) {
            request(`/api/reports/${idx}`, 'POST', JSON.stringify(state),
                {'Content-Type': 'application/json',
                    Authorization: auth.token })
                .then(() => {
                    history.push('/');
                });
        } else {
            request('/api/reports', 'POST', JSON.stringify(state),
                {'Content-Type': 'application/json',
                 Authorization: auth.token })
                .then(() => {
                     history.push('/');
                });
        }
    };

    const onDeleteReport = () => {
        request(`/api/reports/${idx}`, 'DELETE', null,
            {Authorization: auth.token })
            .then(() => {
                history.push('/');
            });
    };

    const onAddItem = (table, item) => {
        const stateTable = getStateTable(table);
        if (item.fond_name === '' || item.fond_percent === 0) {
            return null;
        }

        setState({
            ...state,
            [stateTable]: [...table, {
                id: table.length + 1,
                name: item.fond_name,
                percent: parseFloat(item.fond_percent),
                completed: item.completed
            }]
        });
    };

    const getIndexById = (data, id) => {
        return data.findIndex((el) => el.id === id);
    };

    const onDeleteItem = (table, item) => {
        const idx = getIndexById(table, item.id);
        const stateTable = getStateTable(table);

        const newTableData = [
            ...table.slice(0, idx),
            ...table.slice(idx + 1)
        ];

        setState({
            ...state,
            [stateTable]: newTableData
        });
    };

    const onChangeTableItem = (table, item, percent, name, completed, sum) => {
        const idx = getIndexById(table, item.id);
        const stateTable = getStateTable(table);
        const newTableData = [...table];

        newTableData[idx].name = name !== undefined ? name : table[idx].name;
        newTableData[idx].completed = completed !== undefined ? completed : table[idx].completed;

        console.log(percent)
        if (percent !== -1) {
            newTableData[idx].percent = percent.value;
            newTableData[idx].sum = Math.floor(percent.baseNumber * (percent.value / 100))
        } else {
            newTableData[idx].percent = table[idx].percent;
        }

        if (sum !== undefined) {
            newTableData[idx].sum = sum.value;
            newTableData[idx].percent = state.viruchka === '' || state.viruchka === 0 ?
                table[idx].percent : sum.value * 100 / sum.baseNumber;
        } else {
            newTableData[idx].sum = table[idx].sum;
        }

        setState({
            ...state,
            [stateTable]: newTableData
        });
    };

    const { date, viruchka, tableData2, tableData1, tableData3, skd_ostatok, skd, marga } = state;

    return (
        !loading ? (
        <div className="mt-4 p-4 p-md-5">
            <div className="mb-5">
                <h2 className="mb-3 text-center font-weight-bold">Отчет от { date }</h2>
                <div className='text-center'>
                    {!idx ? <button className="btn btn-link"
                                    onClick={() => {
                                        setState({...state, tableData1: [], tableData2: [], tableData3: []});
                                    }}>
                        Создать чистый шаблон
                    </button> : null}
                </div>
            </div>

            <div className="mb-5">
                <label>Выручка</label>

                <div className="input-group">
                    <input type="text"
                           className="form-control"
                           placeholder={viruchka ? viruchka : 'Например: 1250000'}
                           onChange={(e) => {
                               setState({...state, viruchka: e.target.value})
                           }}
                           value={viruchka}/>
                    <div className="input-group-append">
                        <span className="input-group-text">₽</span>
                    </div>
                </div>
            </div>

            <div className="mt-5">
                <Table name="Фонды выручки"
                       baseNumber={viruchka}
                       tableData={tableData3}
                       onAddItem={onAddItem}
                       onDeleteItem={onDeleteItem}
                       onChangeTableItem={onChangeTableItem}
                       changeMarga={(tableMarga) => {
                           setState({...state, marga: tableMarga});
                       }} />
            </div>

            <div className="mt-5">
                <label>Маржа</label>
                <span className="font-weight-bold ml-4">
                    {viruchka ? marga + ' ₽' : 'Введите выручку'}
                </span>
            </div>


            <div className="mt-5">
                <Table name="Переменно-маржинальные фонды "
                       baseNumber={marga}
                       tableData={tableData1}
                       onAddItem={onAddItem}
                       onDeleteItem={onDeleteItem}
                       onChangeTableItem={onChangeTableItem}
                       changeSKD={(tableSKD) => {
                           setState({...state, skd: tableSKD});
                       }}/>
            </div>


            <div className="mt-5">
                <label>СКД (скорректированный доход от маржинального)</label>
                <span className="font-weight-bold ml-4">{viruchka ? skd + ' ₽' : 'Введите выручку'}</span>
            </div>


            <div className="mt-5 ">
               <Table name="Фонды СКД"
                      baseNumber={skd}
                      tableData={tableData2}
                      onAddItem={onAddItem}
                      onDeleteItem={onDeleteItem}
                      onChangeTableItem={onChangeTableItem}
                      changeOst={(tableOst) => {
                           setState({...state, skd_ostatok: tableOst});
                      }} />
            </div>


            <div className="mt-5">
                <label>Остаток</label>
                <span className="font-weight-bold ml-4">{skd_ostatok} ₽</span>
            </div>

            <div className="row">
                <div className={"col-12" + idx ? "col" : null}>
                    <button type="submit"
                            className="btn btn-success mt-5 btn-block"
                            onClick={() => onSubmit(state)}>
                    Сохранить
                </button></div>
                {idx ?
                    <div className="col">
                        <button type="submit"
                                className="btn btn-danger mt-5 btn-block"
                                onClick={onDeleteReport}>
                            Удалить
                        </button>
                    </div> : null}
            </div>
        </div>) : <div className='mt-5'><Spinner /></div>
    );
};