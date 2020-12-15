"use strict";
import React from "react";
import ReactDOM from "react-dom";
import { createStore } from "redux";
import { Provider } from "react-redux";
import { connect } from "react-redux";
import "./style.scss";
import { bankOne, bankTwo } from "./bank";

//Redux Store
const POWER = "POWER";
const BANK = "BANK";
const VOLUME = "VOLUME";
const DISPLAY = "DISPLAY";
const defaultState = {
    power: false,
    bank: false,
    volume: 0.5,
    display: ""
};
const drumReducer = (state = defaultState, action) => {
    switch(action.type) {
        case POWER:
            return Object.assign({}, state, state.power = !state.power);
        case BANK: 
            return Object.assign({}, state, state.bank = !state.bank);
        case VOLUME: 
            return Object.assign({}, state, state.volume = action.vol);
        case DISPLAY:
            return Object.assign({}, state, state.display = action.disp);
        default:
            return state;
    }
};
const powerAction = () => {
    return {
        type: POWER
    };
};
const bankAction = () => {
    return {
        type: BANK
    };
};
const volAction = (vol) => {
    return {
        type: VOLUME,
        vol: vol
    };
};
const displayAction = (disp) => {
    return {
        type: DISPLAY,
        disp: disp
    };
};
const store = createStore(drumReducer);
store.subscribe(() => console.log(store.getState()));

//React Component
const activeStyle = {
    backgroundColor: 'orange',
    boxShadow: "0 3px orange",
    height: 77,
    marginTop: 13
}
const inactiveStyle = {
    backgroundColor: 'grey',
    marginTop: 10,
    boxShadow: "3px 3px 5px black"
}
class DrumPad extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            padStyle: inactiveStyle
        };
        this.handleKeyPress = this.handleKeyPress.bind(this);
        this.playSound = this.playSound.bind(this);
        this.activatePad = this.activatePad.bind(this);
    }
    handleKeyPress(event) {
        if(event.keyCode === this.props.keyCode) {
            this.playSound();
        }
    }
    activatePad() {
        if(this.props.drumState.power == true) {
            this.setState({
                padStyle: activeStyle
            });
            setTimeout(() => {
                this.setState({
                    padStyle: inactiveStyle
                });
            }, 100);
        } else {
            this.setState({
                padStyle: {
                    height: 77,
                    marginTop: 13,
                    backgroundColor: 'grey',
                    boxShadow: "0 3px grey"
                }
            });
            setTimeout(() => {
                this.setState({ 
                    padStyle: inactiveStyle 
                });
            }, 100);
        }
    }
    playSound() {
        //To play audio 
        const sound = document.getElementById(this.props.keyTrigger);//To get <audio /> element
        if(this.props.drumState.power == true) {
            sound.currentTime = 0;//To set start time
            sound.volume = this.props.drumState.volume;//To set volume
            this.props.setDisplay(this.props.id);
            sound.play();//To play sound
        }
        this.activatePad();
    }
    componentDidMount() {
        document.addEventListener("keydown", this.handleKeyPress);
    }
    componentWillUnmount() {
        document.removeEventListener("keydown", this.handleKeyPress);
    }
    render() {
        return (
            <div id={this.props.clipId} className="drum-pad" style={this.state.padStyle} onClick={this.playSound}>
                <audio className="clip" id={this.props.keyTrigger} src={this.props.clip} />
                <span>{this.props.keyTrigger}</span>
            </div>
        );
    }
}
class PadBank extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        let padBank;
        if(this.props.drumState.bank == false) {
            padBank = bankOne.map((sound, index) => {
                return (
                    <DrumPadContainer key={sound.keyCode} keyCode={sound.keyCode} keyTrigger={sound.keyTrigger} id={sound.id} clip={sound.url} />
                );
            });
        } else {
            padBank = bankTwo.map((sound, index) => {
                return (
                    <DrumPadContainer key={sound.keyCode} keyCode={sound.keyCode} keyTrigger={sound.keyTrigger} id={sound.id} clip={sound.url} />
                );
            });
        }
        return (
            <div className="pad-bank">
                {padBank}
            </div>
        );
    }
}
class Drums extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            powerClicker: {
                float: "left"
            },
            bankClicker: {
                float: "left"
            }
        };
        this.handleChange = this.handleChange.bind(this);
        this.handlePowerClick = this.handlePowerClick.bind(this);
        this.handleBankClick = this.handleBankClick.bind(this);
    }
    handleChange(event) {
        this.props.setVolume(event.target.value);
        if(this.props.drumState.power == true) {
            this.props.setDisplay("Volume: " + Math.floor(event.target.value * 100));
            setTimeout(() => {
                this.props.setDisplay("");
            }, 1500);
        }
    }
    handlePowerClick() {
        this.props.setPower();
        if (this.props.drumState.power == false) {
            this.setState({
                powerClicker: {
                    float: "left"
                }
            });
            this.props.setDisplay("");
        } else {
            this.setState({
                powerClicker: {
                    float: "right"
                }
            });
        };
    }
    handleBankClick() {
        if(this.props.drumState.power == true) {
            this.props.setBank();
            if (this.props.drumState.bank == false) {
                this.setState({
                    bankClicker: { 
                        float: "left" 
                    }
                });
                this.props.setDisplay("Heater Kit");
            } else {
                this.setState({
                    bankClicker: { 
                        float: "right" 
                    }
                });
                this.props.setDisplay("Smooth Piano Kit");
            }
        }
    }
    render() {
        return (
            <div id="drum-machine" className="inner-container">
                <PadBankContainer />
                <div className="logo">
                    <div className="inner-logo">DrumMachine</div>
                    <i className="inner-logo fas fa-ankh"></i>
                </div>
                <div className="controls-container">
                    <div className="control">
                        <p>POWER</p>
                        <div className="select">
                            <div className="inner" style={this.state.powerClicker} onClick={this.handlePowerClick}></div>
                        </div>
                    </div>
                    <p id="display">{this.props.drumState.display}</p>
                    <div className="volume-slider">
                        {/*To input range values*/}
                        <input type="range" step="0.01" min="0" max="1" value={this.props.volume} onChange={this.handleChange} />
                    </div>
                    <div className="control">
                        <p>BANK</p>
                        <div className="select">
                            <div className="inner" style={this.state.bankClicker} onClick={this.handleBankClick}></div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

//Map state, dispatch to props
const mapStateToProps = (state) => {
    return {
        drumState: state
    };
};
const mapDispatchToProps = (dispatch) => {
    return {
        setPower: () => {
            dispatch(powerAction());
        },
        setBank: () => { 
            dispatch(bankAction());
        },
        setVolume: (vol) => { 
            dispatch(volAction(vol));
        },
        setDisplay: (disp) => {
            dispatch(displayAction(disp));
        }
    };
};

//Connect Redux to React
const Container = connect(mapStateToProps, mapDispatchToProps)(Drums);
const PadBankContainer = connect(mapStateToProps, mapDispatchToProps)(PadBank);
const DrumPadContainer = connect(mapStateToProps, mapDispatchToProps)(DrumPad);
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
    document.getElementById("root")
);