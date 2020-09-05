import React, { Component } from "react";
import Table from "./table";

const getDate = () => {
    const date = new Date();
    return `${date.getDate()}.${date.getMonth()}.${date.getFullYear()}, ${date.getHours()}:${date.getMinutes()}`
};

export default class CreateReportPage extends Component {
    state = {
        date: getDate(),
        viruchka: 0,
        tableData1: [
            {id: 1, name: 'Фонд дивидентов', percent: 34},
            {id: 2, name: 'Фонд новых проектов', percent: 3},
            {id: 3, name: 'Фонд долг. резервов', percent: 2},
            {id: 4, name: 'Фонд быстрого реагирования', percent: 2},
            {id: 5, name: 'ФОТ оклад (админ + контент менеджер)', percent: 2},
            {id: 6, name: 'ФОТ сделка (произвд.отдел)', percent: 27},
            {id: 7, name: 'ФОТ сделка (административный отдел)', percent: 2},
            {id: 8, name: 'ФОТ сделка (ФД)', percent: 3},
            {id: 9, name: 'Фонд обязательств (налог,аренда)', percent: 13},
        ],
        tableData2: [
            {id: 1, name: 'Продвижение', percent: 30},
            {id: 2, name: 'Фонд корпоративных расходов', percent: 10},
            {id: 3, name: 'Фонд игр', percent: 5},
            {id: 4, name: 'Фонд приобретения оборудования', percent: 10},
            {id: 5, name: 'Фонд несезона', percent: 22},
            {id: 6, name: 'Офисные расходы (связь,инет,срм,вода и т.д.)', percent: 18},
        ],
        tableData3: [],
        marga: 0,
        skd: 0,
        skd_ostatok: 0
    };

    componentDidMount() {
        const { idx } = this.props;
        if (idx) {
            const state = JSON.parse(localStorage.getItem(localStorage.key(idx)));

            this.setState(state);
        }
    }

    getStateTable = (table) => {
        if (table === this.state.tableData1){
            return 'tableData1';
        } else if ((table === this.state.tableData2)) {
            return 'tableData2'
        } else {
            return 'tableData3';
        }
    };

    onSubmit = (state) => {
        const { idx } = this.props;

        if(idx) {
            localStorage.setItem(`state${idx}`, JSON.stringify(state));
            this.props.history.push('/')
        } else {
            localStorage.setItem(`state${localStorage.length}`, JSON.stringify(state));
            this.props.history.push('/')
        }
    };

    onAddItem = (table, item) => {
        const stateTable = this.getStateTable(table);

        if (item.fond_name === '' || item.fond_percent === 0) {
            return null;
        }

        this.setState((oldState) => {
            return {
                ...oldState,
                [stateTable]: [...table, {
                    id: table.length + 1,
                    name: item.fond_name, percent: parseFloat(item.fond_percent)
                }]
            };
        });
    };

    getIndexById(data, id) {
        return data.findIndex((el) => el.id === id);
    }

    onDeleteItem = (table, item) => {
        const idx = this.getIndexById(table, item.id);
        const stateTable = this.getStateTable(table);

        const newTableData = [
            ...table.slice(0, idx),
            ...table.slice(idx + 1)
        ];

        this.setState({
            [stateTable]: newTableData
        });
    };

    onChangeTableItem = (table, item, percent = -1, name = undefined) => {
        const idx = this.getIndexById(table, item.id);
        const stateTable = this.getStateTable(table);
        const newTableData = [...table];

        if (percent >= 0) {
            if (percent === '') percent = 0;
            newTableData[idx].percent = parseInt(percent);
        } else if (name !== undefined)  {
            newTableData[idx].name = name;
        }

        this.setState({
            [stateTable]: newTableData
        });
    };

    render () {
        const { date, viruchka, tableData2, tableData1, tableData3, skd_ostatok, skd, marga } = this.state;

        return (
            <div className="mt-4 p-5">
                <div className="d-flex align-items-top justify-content-between mb-4">
                    <h2 className="mb-4 font-weight-bold">Отчет от { date }</h2>
                    <div>
                        <button className="btn btn-outline-dark"
                                onClick={() => {
                                    this.setState({tableData1: [], tableData2: []});
                                }}>
                            Создать чистый шаблон
                        </button>
                    </div>
                </div>

                    <div className="form-inline mb-3">
                        <label>Выручка</label>
                        <input type="text"
                               className="form-control ml-4 mr-3 w-25"
                               placeholder={viruchka ? viruchka : 'Например: 1250000'}
                               onChange={(e) => {
                                   this.setState({viruchka: e.target.value})
                               }}
                               value={viruchka}/>
                        <span>₽</span>
                    </div>

                    <div className="mt-4">
                        <Table name="Фонды выручки"
                               viruchka={viruchka}
                               tableData={tableData3}
                               onAddItem={this.onAddItem}
                               onDeleteItem={this.onDeleteItem}
                               onChangeTableItem={this.onChangeTableItem}
                               changeMarga={(tableMarga) => {
                                   this.setState((oldState) => {
                                       if (oldState.marga !== tableMarga && !isNaN(viruchka)) {
                                           return {marga: tableMarga};
                                       }
                                   });
                               }} />
                    </div>

                    <div className="form-inline mt-5">
                        <label>Маржа - </label>
                        <span className="font-weight-bold ml-4">
                            {viruchka ? marga + ' ₽' : 'Введите выручку'}
                        </span>
                    </div>


                    <div className="mt-4">
                        <Table name="Переменно-маржинальные фонды "
                               viruchka={marga}
                               tableData={tableData1}
                               onAddItem={this.onAddItem}
                               onDeleteItem={this.onDeleteItem}
                               onChangeTableItem={this.onChangeTableItem}
                               changeSKD={(tableSKD) => {
                                   this.setState((oldState) => {
                                       if (oldState.skd !== tableSKD && !isNaN(viruchka)) {
                                           return {skd: tableSKD};
                                       }
                                   });
                               }}/>
                    </div>


                    <div className="form-inline mt-5">
                        <label>СКД (скорректированный доход от маржинального) - </label>
                        <span className="font-weight-bold ml-4">{skd} ₽</span>
                    </div>


                    <div className="mt-4">
                       <Table name="Фонды СКД"
                              viruchka={skd}
                              tableData={tableData2}
                              onAddItem={this.onAddItem}
                              onDeleteItem={this.onDeleteItem}
                              onChangeTableItem={this.onChangeTableItem}
                              changeOst={(tableOst) => {
                                   this.setState((oldState) => {
                                       if (oldState.skd_ostatok !== tableOst && !isNaN(viruchka)) {
                                           return {skd_ostatok: tableOst};
                                       }
                                   });
                              }} />
                    </div>


                    <div className="form-inline mt-5">
                        <label>Остаток - </label>
                        <span className="font-weight-bold ml-4">{skd_ostatok} ₽</span>
                    </div>

                    <button type="submit"
                            className="btn btn-success mt-5 btn-block"
                            onClick={() => this.onSubmit(this.state)}>
                        Сохранить
                    </button>
            </div>
        );
    }
};