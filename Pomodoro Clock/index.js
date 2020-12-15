"use strict";
import React from "react";
import ReactDOM from "react-dom";
import { createStore } from "redux";
import { Provider } from "react-redux";
import { connect } from "react-redux";
import "./style.scss";

//Redux Store
const SET_BREAK = "SET_BREAK";
const SET_SESSION = "SET_SESSION";
const START_STOP = "START_STOP";
const RESET = "RESET";
const REDUCE_TIMER = "REDUCE_TIMER";
const SET_TIMER = "SET_TIMER";
const SET_DISPLAY = "SET_DISPLAY";
const SET_COLOR = "SET_COLOR";
const SET_TYPE = "SET_TYPE";
const defaultState = {
    break: 5,
    running: false,
    timer: 1500,
    type: "Session",
    alarmColor: { color: "white" },
    display: "25:00" 
};
const clockReducer = (state = defaultState, action) => {
    switch(action.type) {
        case SET_BREAK: 
            if(action.todo == "+BR") {
                return Object.assign({}, state, { break: state.break + 1 });
            } else if(action.todo == "-BR" && state.break > 1) {
                return Object.assign({}, state, { break: state.break - 1 });
            } else {
                return state;
            }
        case SET_SESSION:
            if(action.todo == "+SE") {
                return Object.assign({}, state, { timer: state.timer + 60 });
            } else if (action.todo == "-SE" && state.timer > 60) {
                return Object.assign({}, state, { timer: state.timer - 60 });
            } else {
                return state;
            }
        case START_STOP:
            return Object.assign({}, state, state.running = !state.running);
        case RESET:
            return Object.assign({}, {
                break: 5,
                running: false,
                timer: 1500,
                type: "Session",
                alarmColor: { color: "white" },
                display: "25:00"
            });
        case REDUCE_TIMER: 
            return Object.assign({}, state, { timer: state.timer - 1 });
        case SET_TIMER:
            return Object.assign({}, state, { timer: action.timer })
        case SET_DISPLAY:
            return Object.assign({}, state, { display: action.output });
        case SET_COLOR:
            return Object.assign({}, state, { alarmColor: action.color });
        case SET_TYPE:
            return Object.assign({}, state, { type: "Break" });
        default:
            return state;
    }
};
const setBreakAction = (operation) => {
    return {
        type: SET_BREAK,
        todo: operation
    };
};
const setSessionAction = (operation) => {
    return {
        type: SET_SESSION,
        todo: operation
    };
};
const startStopAction = () => {
    return {
        type: START_STOP
    };
};
const resetAction = () => {
    return {
        type: RESET
    };
};
const reduceTimerAction = () => {
    return {
        type: REDUCE_TIMER
    };
};
const setTimerAction = (timer) => {
    return {
        type: SET_TIMER,
        timer: timer
    };
};
const setDisplayAction = (output) => {
    return {
        type: SET_DISPLAY,
        output: output
    };
};
const setColorAction = (color) => {
    return {
        type: SET_COLOR,
        color: color
    };
};
const setTypeAction = () => {
    return {
        type: SET_TYPE
    };
};
const store = createStore(clockReducer);
store.subscribe(() => console.log(store.getState()));

//React Component
let INTERVAL, SESSION = 25;
class PomodoroClock extends React.Component {
    constructor(props) {
        super(props);
        this.handleClickBreak = this.handleClickBreak.bind(this);
        this.handleClickSession = this.handleClickSession.bind(this);
        this.clockify = this.clockify.bind(this);
        this.handleClickTimer = this.handleClickTimer.bind(this);
        this.handleClickReset = this.handleClickReset.bind(this); 
    }
    handleClickBreak(event) {
        if(!this.props.state.running) {
            this.props.handleBreak(event.target.id);
        }
    }
    handleClickSession(event) {
        if(!this.props.state.running) {
            this.props.handleSession(event.target.id);
            if(event.target.id == "+SE") {
                this.clockify(this.props.state.timer + 60);
                SESSION = Math.floor((this.props.state.timer + 60) / 60);
            } else if(event.target.id == "-SE" && SESSION > 1) {
                this.clockify(this.props.state.timer - 60);
                SESSION = Math.floor((this.props.state.timer - 60) / 60);
            }
        }
    }
    clockify(value = this.props.state.timer) {
        var minutes = Math.floor(value / 60);
        var seconds = value - minutes * 60;
        if(minutes < 10) {
            minutes = "0" + minutes;
        }
        if(seconds < 10) {
            seconds = "0" + seconds;
        }
        if(this.props.state.timer < 60) {
            this.props.handleColor({
                color: "red"
            });
        } else {
            this.props.handleColor({
                color: "white"
            });
        }
        if(this.props.state.timer == 0) {
            //Play Sound
            var sound = document.getElementById("beep");
            sound.currentTime = 0;
            sound.play();
            //Reset to break 
            var breakValue = this.props.state.break * 60;
            console.log(breakValue);
            this.props.handleSetTimer(breakValue);
            if(this.props.state.type == "Session") {
                this.props.handleType();
            }
        } 
        var display = minutes + ":" + seconds;
        this.props.handleDisplay(display);
    }
    handleClickTimer() {
        this.props.handleStartStop();
        if(this.props.state.running) {
            INTERVAL = setInterval(() => {
                this.props.handleReduceTimer();
                this.clockify();
            }, 1000);
        } else {
            clearInterval(INTERVAL);
        }
    }
    handleClickReset() {
        clearInterval(INTERVAL);
        this.props.handleReset();
        SESSION = 25;
    }
    render() {
        return (
            <div id="app">
                <div id="title" className="main-title">
                Pomodoro Clock
                </div>
                <div id="break" className="length-control">
                    <div id="break-label">Break Length</div>
                    <button id="break-decrement" className="btn-level" onClick={this.handleClickBreak}>
                        <i id="-BR" className="fa fa-arrow-down fa-2x" />
                    </button>
                    <div id="break-length" className="btn-level">{this.props.state.break}</div>
                    <button id="break-increment" className="btn-level" onClick={this.handleClickBreak}>
                        <i id="+BR" className="fa fa-arrow-up fa-2x" />
                    </button>
                </div>
                <div id="session" className="length-control">
                    <div id="session-label">Session Length</div>
                    <button id="session-decrement" className="btn-level" onClick={this.handleClickSession}>
                        <i id="-SE" className="fa fa-arrow-down fa-2x" />
                    </button>
                    <div id="session-length" className="btn-level">{SESSION}</div>
                    <button id="session-increment" className="btn-level" onClick={this.handleClickSession}>
                        <i id="+SE" className="fa fa-arrow-up fa-2x" />
                    </button>
                </div>
                <div id="timer" className="timer" style={this.props.state.alarmColor}>
                    <div className="timer-wrapper">
                        <div id="timer-label">{this.props.state.type}</div>
                        <div id="time-left">{this.props.state.display}</div>
                    </div>
                </div>
                <div id="timer-control" className="timer-control">
                    <button id="start-stop" onClick={this.handleClickTimer}>
                        <i className="fa fa-play fa-2x" />
                        <i className="fa fa-pause fa-2x" />
                    </button>
                    <button id="reset" onClick={this.handleClickReset}>
                        <i className="fa fa-refresh fa-2x" />
                    </button>
                </div>
                <div id="author" className="author">
                    Coded by <a href="https://github.com/louijose/" target="_blank">Jose</a>
                </div>
                <audio id="beep" preload="auto" src="https://goo.gl/65cBl1" />
            </div>
        );
    }
}

//Map state, dispatch to props
const mapStatetoProps = (state) => {
    return {
        state: state
    };
};
const mapDispatchToProps = (dispatch) => {
    return {
        handleBreak: (event) => {
            dispatch(setBreakAction(event));
        },
        handleSession: (event) => {
            dispatch(setSessionAction(event));
        },
        handleStartStop: () => {
            dispatch(startStopAction());
        },
        handleReset: () => {
            dispatch(resetAction());
        },
        handleReduceTimer: () => {
            dispatch(reduceTimerAction());
        },
        handleSetTimer: (event) => {
            dispatch(setTimerAction(event));
        },
        handleDisplay: (event) => {
            dispatch(setDisplayAction(event));
        },
        handleColor: (event) => {
            dispatch(setColorAction(event));
        },
        handleType: () => {
            dispatch(setTypeAction());
        }
    };
};

//Connect Redux and React
const Container = connect(mapStatetoProps, mapDispatchToProps)(PomodoroClock);

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
    document.getElementById("container")
);

