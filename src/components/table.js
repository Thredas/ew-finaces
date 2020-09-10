import React, { useEffect, useState } from "react";

import './table.css'

export default function Table({ name, tableData, baseNumber, onAddItem,
                                  onDeleteItem, onChangeTableItem,
                                  changeSKD, changeOst, changeMarga }) {
    const [state, setState] = useState({
        fond_name: '',
        fond_percent: 0
    });

    const buildList = (tableData, baseNumber, onDelete,
                 onChangeTableItem) => {
        let last_ost = baseNumber;

        return tableData.map((el) => {
            last_ost = last_ost - baseNumber * (el.percent / 100);
            return (
                <tr key={el.id}>
                    <td style={{'width': '50%'}}>
                        <input type="text"
                               className="w-75"
                               value={el.name}
                               onChange={(e) => onChangeTableItem(tableData, el, -1, e.target.value)} />

                        <button type="button"
                                onClick={() => onDelete(tableData, el)}
                                className="btn
								   btn-outline-danger
								   btn-sm
								   float-right">
                            <i className="fa fa-trash-o" />
                        </button>
                    </td>

                    <td>
                        <input type="text"
                               value={el.percent}
                               onChange={(e) => onChangeTableItem(tableData, el,
                                   {baseNumber: baseNumber, value: e.target.value})} />
                    </td>

                    <td>
                        <input value={el.sum}
                               placeholder={Math.floor(baseNumber * (el.percent / 100))}
                               onChange={(e) => onChangeTableItem(tableData, el,
                            -1, undefined, undefined, {baseNumber: baseNumber, value: e.target.value} )} />
                    </td>

                    <td>{Math.floor(last_ost)} ₽</td>

                    <td className=''>
                        <input type="checkbox"
                               className="checkbox"
                               checked={el.completed}
                               onChange={(e) => onChangeTableItem(tableData, el,
                                   -1, undefined, e.target.checked)} />
                    </td>
                </tr>
            );
        });
    };

    useEffect(() => {
        let all_sum = 0;
        tableData.forEach((el) => {
            all_sum += Math.floor(baseNumber * (el.percent / 100));
        });

        if (changeSKD){
            changeSKD(baseNumber - all_sum);
        } else if (changeOst) {
            changeOst(baseNumber - all_sum);
        } else {
            changeMarga(baseNumber - all_sum);
        }
    }, [baseNumber, tableData]);

    let all_percent = 0;
    let all_sum = 0;

    tableData.forEach((el) => {
        all_percent += parseFloat(el.percent);
        all_sum += Math.floor(baseNumber * (el.percent / 100));
    });

    return (
        <div className='table-responsive'>
            <div className="mb-4">
                <h4 className="mb-3">{ name }</h4>
                <div className="">
                    <span className='font-weight-bold mr-5'>{all_percent} %</span>
                    <span className='font-weight-bold'>{all_sum} ₽</span>
                </div>
            </div>

            <table className="table table-bordered">
                <thead className="thead-light">
                <tr>
                    <th scope="col">Фонды</th>
                    <th scope="col">%</th>
                    <th scope="col">Сумма</th>
                    <th scope="col">Остаток</th>
                    <th scope="col" className='checkbox'>Вып</th>
                </tr>
                </thead>

                <tbody>
                { buildList(tableData, baseNumber, onDeleteItem, onChangeTableItem) }
                </tbody>
            </table>

            <div className="form-group p-1">
                <label>Название фонда:</label>
                <input className="form-control w-50 w-md-100"
                       value={state.fond_name}
                       onChange={(e) => setState({
                           ...state,
                           fond_name: e.target.value
                       })} />

                <label>Проценты фонда:</label>
                <input className="form-control w-50 w-md-100"
                       value={state.fond_percent}
                       onChange={(e) => setState({
                            ...state,
                            fond_percent: e.target.value
                       })} />

                <button type="button" className="btn btn-outline-primary mt-3"
                        onClick={() => {
                            onAddItem(tableData, state);
                            setState({fond_name: '', fond_percent: 0});
                        }}>+ Добавить фонд</button>
            </div>
        </div>
    );
};