"use strict";
import React from "react";
import ReactDOM from "react-dom";
import { createStore } from "redux";
import { Provider } from "react-redux";
import { connect } from "react-redux";
import "./style.scss";

//Redux Store
const HANDLE_NUMBERS = "HANDLE_NUMBERS";
const HANDLE_DECIMAL = "HANDLE_DECIMAL";
const HANDLE_OPERATORS =  "HANDLE_OPERATORS";
const HANDLE_EVALUATE = "HANDLE_EVALUATE";
const INITIALIZE = "INITIALIZE";
const SET_VALUE = "SET_VALUE";
const defaultState = {
    formula: "0",
    currentValue: "0",
    previousValue: "",
    lastClicked: "",
    evaluated: false
};
const isOperator = /[x/+‑]/,
    endsWithOperator = /[x+‑/]$/,
    containsPeriod = /\w*\.\w*/,
    endsWithPeriod = /\w*\./,
    equalityCheck = /=/,
    clearStyle = { 
        background: '#ac3939' 
    },
    operatorStyle = { 
        background: '#666666' 
    },
    equalsStyle = {
        background: '#004466',
        position: 'absolute',
        height: 130,
        bottom: 5
    };
const calculatorReducer = (state = defaultState, action) => {
    switch(action.type) {
        case HANDLE_NUMBERS: 
            if(state.evaluated == true) {
                return Object.assign({}, defaultState, {
                    currentValue: action.number,
                    formula: action.number
                });
            }
            var number = "";
            var formula = "";
            if(state.currentValue == "0") {
                number = action.number;
                if(state.formula == "0") {
                    formula = number;
                }
            } else if(state.currentValue.length < 21) {
                number += state.currentValue + action.number;
                formula += state.formula + action.number;
                if(isOperator.test(state.lastClicked)) {
                    number = action.number;
                    formula = state.formula + action.number;
                }
            } else {
                number = state.currentValue;
                formula = state.formula;
            }
            return Object.assign({}, state, { 
                currentValue: number,
                formula: formula,
                lastClicked: action.number
            });
        case HANDLE_DECIMAL:
            if(state.evaluated == true) {
                return Object.assign({}, defaultState, {
                    currentValue: "0.",
                    formula: "0."
                });
            }
            var number = "";
            var formula = "";
            if(!containsPeriod.test(state.currentValue)) {
                if(state.currentValue.length < 21) {
                    number += state.currentValue + ".";
                    formula += state.formula + ".";
                }
                if(isOperator.test(state.lastClicked)) {
                    number =  "0.";
                    formula = state.formula + "0.";
                }
            } else {
                number = state.currentValue;
                formula = state.formula;
            }
            return Object.assign({}, state, {
                currentValue: number,
                formula: formula,
                lastClicked: "."
            });
        case HANDLE_OPERATORS:
            if(state.evaluated == true) {
                return Object.assign({}, state, (state = defaultState));
            }
            var operator = action.operator;
            if(operator == "x") {
                operator = "*";
            } else if(operator == "‑") {
                operator = "-";
            }
            var formula = state.formula + operator;
            if(isOperator.test(state.lastClicked)) {
                formula = state.formula.slice(0, state.formula.length - 1) + operator; 
            }
            if(endsWithPeriod.test(state.lastClicked)) {
                formula = state.formula + "0" + operator;
            }
            if(state.currentValue == "0" && operator == "-") {
                formula = operator; 
            }
            return Object.assign({}, state, {
                currentValue: operator,
                formula: formula,
                lastClicked: action.operator
            });
        case HANDLE_EVALUATE:
            var formula = state.formula;
            var sum = "";
            console.log(eval("+0.950+3"));
            if(!equalityCheck.test(state.lastClicked)) {
                if(endsWithOperator.test(state.lastClicked) || endsWithPeriod.test(state.lastClicked)) {
                    formula = state.formula.slice(0, state.formula.length - 1);
                } 
                sum = eval(formula).toString();
                formula = formula + "=" + sum;
            } else {
                sum = state.currentValue;
                formula = state.formula
            }
            return Object.assign({}, state, {
                currentValue: sum,
                formula: formula,
                lastClicked: "=",
                evaluated: true
            });
        case INITIALIZE: 
            return Object.assign({}, state, state = defaultState);
        case SET_VALUE:
            return Object.assign({}, state, action.state);
        default:
            return state;
    }
};
const initializeAction = () => {
    return {
        type: INITIALIZE
    };
};
const numbersAction = (event) => {
    return {
        type: HANDLE_NUMBERS,
        number: event.target.value
    };
};
const decimalAction = () => {
    return {
        type: HANDLE_DECIMAL
    };
};
const operatorsAction = (event) => {
    return {
        type: HANDLE_OPERATORS,
        operator: event.target.value
    };
};
const evaluateAction = () => {
    return {
        type: HANDLE_EVALUATE
    };
};
const setValueAction = (newState) => {
    return {
        type: SET_VALUE,
        state: newState
    };
};
const store = createStore(calculatorReducer);
store.subscribe(() => console.log(store.getState()));

//React Component
class Buttons extends React.Component {
    constructor(props) {
        super(props);
        this.handleMaxDigit = this.handleMaxDigit.bind(this);
    }
    handleMaxDigit() {
        if(this.props.state.currentValue.length == 21) {
            this.props.setValue(Object.assign({}, this.props.state, {
                previousValue: this.props.state.currentValue
            }));
            this.props.setValue(Object.assign({}, this.props.state, {
                currentValue: "LIMIT REACHED!"
            }));
            setTimeout(() => {
                this.props.setValue(Object.assign({}, this.props.state, {
                    currentValue: this.props.state.previousValue
                }));
            }, 200);
        }
    }
    componentDidMount() {
        document.addEventListener("click", this.handleMaxDigit);
    }
    render() {
        return (
            <div>
                <button id="clear" value='AC' onClick={this.props.initialize} className='jumbo' style={clearStyle}>AC</button>
                <button id="divide" value='/' onClick={this.props.operators} style={operatorStyle}>/</button>
                <button id="multiply" value='x' onClick={this.props.operators} style={operatorStyle}>x</button>
                <button id="seven" className="number" value='7' onClick={this.props.numbers}>7</button>
                <button id="eight" value='8' className="number" onClick={this.props.numbers}>8</button>
                <button id="nine" value='9' className="number" onClick={this.props.numbers}>9</button>
                <button id="subtract" value='‑' onClick={this.props.operators} style={operatorStyle}>-</button>
                <button id="four" value='4' onClick={this.props.numbers}>4</button>
                <button id="five" value='5' onClick={this.props.numbers}>5</button>
                <button id="six" value='6' onClick={this.props.numbers}>6</button>
                <button id="add" value='+' onClick={this.props.operators} style={operatorStyle}>+</button>
                <button id="one" value='1' onClick={this.props.numbers}>1</button>
                <button id="two" value='2' onClick={this.props.numbers}>2</button>
                <button id="three" value='3' onClick={this.props.numbers}>3</button>
                <button id="zero" value='0' onClick={this.props.numbers} className="jumbo">0</button>
                <button id="decimal" value='.' onClick={this.props.decimal}>.</button>
                <button id="equals" value='=' onClick={this.props.evaluate} style={equalsStyle}>=</button>
            </div>
        );
    }
}
class Output extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <div id="display" className="outputScreen">
                {this.props.state.currentValue}
            </div>
        );
    }
}
class Formula extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <div className="formulaScreen">
                {this.props.state.formula}
            </div>
        );
    }
};
class Calculator extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <div>
                <div className='calculator'>
                    <FormulaContainer />
                    <OutputContainer />
                    <ButtonsContainer />
                </div>
                <div className="author">
                    Coded By <a target="_blank" href="https://github.com/louijose/">Jose</a>
                </div>
            </div>
        );
    }
}

//Map state, dispatch to props
const mapStateToProps = (state) => {
    return {
        state: state
    };
};
const mapDispatchToProps = (dispatch) => {
    return {
        initialize: () => {
            dispatch(initializeAction());
        },
        numbers: (event) => {
            dispatch(numbersAction(event));
        },
        decimal: () => {
            dispatch(decimalAction());
        },
        operators: (event) => {
            dispatch(operatorsAction(event));
        }, 
        evaluate: () => {
            dispatch(evaluateAction());
        },
        setValue: (state) => {
            dispatch(setValueAction(state));
        }
    };
};

//Connect Redux to React
const ButtonsContainer = connect(mapStateToProps, mapDispatchToProps)(Buttons);
const FormulaContainer = connect(mapStateToProps, mapDispatchToProps)(Formula);
const OutputContainer = connect(mapStateToProps, mapDispatchToProps)(Output);
const Container = connect(mapStateToProps, mapDispatchToProps)(Calculator);

class Presentation extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <Provider store={store}>
                <Container />
            </Provider>
        );
    }
}
ReactDOM.render(
    <Presentation />,
    document.getElementById("app")
);
