import React, { Component } from "react";

export default class Table extends Component {
    state = {
        fond_name: '',
        fond_percent: 0
    };

    buildList = (tableData, viruchka, onDelete,
                 onChangeTableItem) => {
        let last_ost = viruchka;

        return tableData.map((el) => {
            last_ost = last_ost - viruchka * (el.percent / 100);

            return (
                <tr key={el.id}>
                    <th>
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
                    </th>
                    <td><input type="text"
                               value={el.percent}
                               onChange={(e) => onChangeTableItem(tableData, el, e.target.value)} />
                    </td>
                    <td>{Math.floor(viruchka * (el.percent / 100))} ₽</td>
                    <td>{last_ost} ₽</td>
                </tr>
            );
        });
    };

    componentDidUpdate(prevProps, prevState, snapshot) {
        const { tableData, viruchka, changeSKD, changeOst, changeMarga } = this.props;

        let all_sum = 0;
        tableData.forEach((el) => {
            all_sum += Math.floor(viruchka * (el.percent / 100));
        });

        if(changeSKD){
            changeSKD(viruchka - all_sum);
        } else if (changeOst) {
            changeOst(viruchka - all_sum);
        } else {
            changeMarga(viruchka - all_sum);
        }
    }

    render() {
        const { name, tableData, viruchka, onAddItem,
            onDeleteItem, onChangeTableItem } = this.props;

        let all_percent = 0;
        let all_sum = 0;
        tableData.forEach((el) => {
            all_percent += el.percent;
            all_sum += Math.floor(viruchka * (el.percent / 100));
        });

        return (
            <React.Fragment>
                <div className="d-flex align-items-center mb-4">
                    <h4 className="mr-4">{ name }</h4>
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
                    </tr>
                    </thead>

                    <tbody>
                    { this.buildList(tableData, viruchka, onDeleteItem, onChangeTableItem) }
                    </tbody>
                </table>

                <div className="form-group form-inline">
                    <label>Название фонда:</label>
                    <input className="form-control ml-3 mr-4"
                           value={this.state.fond_name}
                           onChange={(e) => this.setState({
                               fond_name: e.target.value
                           })} />

                    <label>Проценты фонда:</label>
                    <input className="form-control ml-3 mr-4"
                           value={this.state.fond_percent}
                           onChange={(e) => this.setState({
                                fond_percent: e.target.value
                           })} />

                    <button type="button" className="btn btn-outline-primary"
                            onClick={() => {
                                onAddItem(tableData, this.state);
                                this.setState({fond_name: '', fond_percent: 0});
                            }}>+ Добавить фонд</button>
                </div>

            </React.Fragment>
        );
    }
};