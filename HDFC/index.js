"use strict";
import React from "react";
import ReactDOM from "react-dom";
import { createStore } from "redux";
import { Provider } from "react-redux";
import { connect } from "react-redux";
import "./style.scss";

//Redux Store
const GET_DATA = "GET_DATA";
const ALTER_DISPLAY = "ALTER_DISPLAY";

const defaultState = {
    data: [],
    display: []
};
const dataReducer = (state = defaultState, action) => {
    switch(action.type) {
        case GET_DATA:
            return Object.assign({}, state, state.data = action.input);
        case ALTER_DISPLAY:
            return Object.assign({}, state, state.display = action.display);
        default:
            return state;
    }
};
const getDataAction = (input) => {
    return {
        type: GET_DATA,
        input: input
    };
};
const setDisplayAction = (display) => {
    return {
        type: ALTER_DISPLAY,
        display: display
    };
};
const store = createStore(dataReducer);

//React Component
class ListingPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            input: "",
            sort: "input"
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChangeSort = this.handleChangeSort.bind(this);
        this.handleSortAscending = this.handleSortAscending.bind(this);
        this.handleSortDescending = this.handleSortDescending.bind(this);
        this.handleKeyPress = this.handleKeyPress.bind(this);
    }
    handleChange(event) {
        this.setState({
            input: event.target.value
        });
    }
    handleSubmit() {
        this.props.setDisplay(this.props.state.data.filter(
            element => {
              var regex = new RegExp(this.state.input, "gi");
              return regex.test(element.by);
            }
        ));
    }
    handleChangeSort(event) {
        this.setState({
            sort: event.target.value
        })
    }
    handleSortAscending() {        
        switch(this.state.sort) {
            case "input":
                break;
            case "percentage":
                this.props.setDisplay([].concat(this.props.state.display).sort((a, b) => {
                    return a["percentage.funded"] - b["percentage.funded"];
                }));
                break;
            case "title":
                this.props.setDisplay([].concat(this.props.state.display).sort((a, b) => {
                    return (a["title"] > b["title"]) ? 1 : -1;
                }));
                break;
            case "by":
                this.props.setDisplay([].concat(this.props.state.display).sort((a, b) => {
                    return (a["by"] > b["by"]) ? 1 : -1;
                }));
                break;
            case "date":
                this.props.setDisplay([].concat(this.props.state.display).sort((a, b) => {
                    return (a["end.time"] > b["end.time"]) ? 1 : -1;
                }));
                break;
            default:
                break;
        }
    }
    handleSortDescending() {
        switch (this.state.sort) {
            case "input":
                break;
            case "percentage":
                this.props.setDisplay([].concat(this.props.state.display).sort((a, b) => {
                    return b["percentage.funded"] - a["percentage.funded"];
                }));
                break;
            case "title":
                this.props.setDisplay([].concat(this.props.state.display).sort((a, b) => {
                    return (a["title"] > b["title"]) ? -1 : 1;
                }));
                break;
            case "by":
                this.props.setDisplay([].concat(this.props.state.display).sort((a, b) => {
                    return (a["by"] > b["by"]) ? -1 : 1;
                }));
                break;
            case "date":
                this.props.setDisplay([].concat(this.props.state.display).sort((a, b) => {
                    return (a["end.time"] > b["end.time"]) ? -1 : 1;
                }));
                break;
            default:
                break;
        }
    }
    handleKeyPress(event) {
        if(event.keyCode === 13) {
            this.handleSubmit();
        }
    }
    componentDidMount() {
        fetch("http://starlord.hackerearth.com/kickstarter").then((result) => {
            return result.json();
        }).then((data) => {
            this.props.getData(data);
            this.props.setDisplay(data);
        });
        document.addEventListener("keydown", this.handleKeyPress);
    }
    componentWillUnmount() {
        document.removeEventListener("keydown", this.handleKeyPress);
    }
    render() {
        const list = this.props.state.display.map((element) => {
            return (
                <tr key={element["s.no"]}>
                    <td>{element["title"]}</td>
                    <td>{element["by"]}</td>
                    <td>{element["type"]}</td>
                    <td>{element["country"]}, {element["state"]}, {element["location"]}</td>
                    <td>{element["end.time"]}</td>
                    <td>{element["num.backers"]}</td>
                    <td>{element["amt.pledged"]} {element["currency"]}</td>
                    <td>{element["percentage.funded"]}</td>
                </tr>
            )
        });
        return (
            <div>
                <div id="top">
                    <header>
                        <h1>Kickstarter Projects</h1>
                    </header>
                    <div id="search-sort" className="row form-group">
                        <div id="search-input" className="col-md-4">
                            <input value={this.state.input} className="form-control" placeholder="Search..." onChange={this.handleChange} />
                        </div>
                        <div id="search-button" className="col-md-2">
                            <button className="btn btn-default btn-info" onClick={this.handleSubmit}>Search</button>
                        </div>
                        <div id="sort-select" className="col-md-2">
                            <select className="form-control" defaultValue="input" onChange={this.handleChangeSort}>
                                <option value="input" disabled>Sort By...</option>
                                <option value="percentage">Percentage Funded</option>
                                <option value="title">Title</option>
                                <option value="by">Project By</option>
                                <option value="date">End Date</option>
                            </select>
                        </div>
                        <div id="sort-button" className="col-md-2">
                            <button className="btn btn-default btn-info" onClick={this.handleSortAscending}>Sort Ascending</button>
                        </div>
                        <div id="sort-button" className="col-md-2">
                            <button className="btn btn-default btn-info" onClick={this.handleSortDescending}>Sort Descending</button>
                        </div>
                    </div>
                </div>
                <table className="text-center table table-hover">
                    <thead>
                        <tr>
                            <th className="text-center align-middle">Title</th>
                            <th className="text-center align-middle">Project by</th>
                            <th className="text-center align-middle">Type</th>
                            <th className="text-center align-middle">Country, State, Location</th>
                            <th className="text-center align-middle">End Time</th>
                            <th className="text-center align-middle">Number of Backers</th>
                            <th className="text-center align-middle">Amount Pledged</th>
                            <th className="text-center align-middle">Percentage Funded</th>
                        </tr>
                    </thead>
                    <tbody>
                        {list}
                    </tbody>
                </table>
            </div>
        )
    }
}

//Map state, dispatch to props
const mapStateToProps = (state) => {
    return {
        state: state
    }
};
const mapDispatchToProps = (dispatch) => {
    return {
        getData: (input) => {
            dispatch(getDataAction(input));
        },
        setDisplay: (display) => {
            dispatch(setDisplayAction(display));
        }
    };
};

//Connect Redux to React
const Container = connect(mapStateToProps, mapDispatchToProps)(ListingPage);

class Presentation extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <Provider store={store}>
                <Container />
            </Provider>
        )
    }
}
ReactDOM.render(
    <Presentation />,
    document.getElementById("root")
);