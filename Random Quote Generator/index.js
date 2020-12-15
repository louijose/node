"use strict";
import React from "react";
import ReactDOM from "react-dom";
import { createStore } from "redux";
import { Provider } from "react-redux";
import { connect } from "react-redux";
import { quotes, colors } from "./data";
import "./style.scss";

//Redux Store
const RANDOM_QUOTE = "RANDOM_QUOTE";
const defaultState = {
    quote: "QUOTE GENERATOR",
    author: "",
    color: "cyan"
};
const quoteReducer = (state = defaultState, action) => {
    switch(action.type) {
        case RANDOM_QUOTE: 
            return Object.assign({}, state, {
                quote: action.newQuote,
                author: action.newAuthor,
                color: action.newColor
            });
        default: 
            return state;
    }
};
const store = createStore(quoteReducer);
const randomQuoteAction = (newQuote, newAuthor, newColor) => {
    return {
        type: RANDOM_QUOTE,
        newQuote,
        newAuthor,
        newColor
    };
};
store.subscribe(() => console.log(store.getState()));

//React Components
class RandomQuote extends React.Component {
    constructor(props) {
        super(props);
        this.handleClick = this.handleClick.bind(this);
    }
    handleClick() {
        var randQuote = Math.floor(Math.random() * 102);
        var randColor = Math.floor(Math.random() * 12);
        this.props.randomQuote(quotes[randQuote].quote, "-" + quotes[randQuote].author, colors[randColor]);
        $(".btn").css("background-color", this.props.randGen.color);
        $("#text").addClass("animated rubberBand");
        $("#author").addClass("animated slideInRight");
        $(".btn").css("color", "white");
        $("body").css("background-color", this.props.randGen.color);
        $("#quote-box").css("color", this.props.randGen.color);
        setTimeout(() => {
            $("#text").removeClass("animated rubberBand");
            $("#author").removeClass("animated slideInRight");
        }, 1000); 
    }
    render() {
        return (
            <div id="container">
                <div id="quote-box">
                    <div id="text">
                        <p>
                        {this.props.randGen.quote != "QUOTE GENERATOR" && <i className="fa fa-quote-left"></i>}        {this.props.randGen.quote}
                        </p>
                    </div>
                    <div id="author">
                        {this.props.randGen.author}
                    </div>
                    <div id="buttons">
                        <a id="tweet-quote" className="btn btn-default" target="_blank" href="https://twitter.com/intent/tweet?hashtags=quotes&amp;related=freecodecamp&amp;text=%22The%20best%20revenge%20is%20massive%20success.%22%20Frank%20Sinatra"><i className="fa fa-twitter"></i></a>
                        <a id="tumblr-quote" className="btn btn-default" target="_blank" href="https://www.tumblr.com/widgets/share/tool?posttype=quote&amp;tags=quotes,freecodecamp&amp;caption=Frank%20Sinatra&amp;content=The%20best%20revenge%20is%20massive%20success.&amp;canonicalUrl=https%3A%2F%2Fwww.tumblr.com%2Fbuttons&amp;shareSource=tumblr_share_button"><i className="fa fa-tumblr"></i></a>
                        <button id="new-quote" className="btn btn-default" onClick={this.handleClick}>New quote</button>
                    </div>
                </div>
                <footer>
                    Coded by <a href="https://github.com/louijose/" target="_blank">Jose</a>
                </footer>
            </div>
        );
    }
}

//Map state, dispatch to props
const mapStateToProps = (state) => {
    return {
        randGen: state
    };
};
const mapDispatchToProps = (dispatch) => {
    return {
        randomQuote: (quote, author, color) => {
            dispatch(randomQuoteAction(quote, author, color));
        }
    };
};

//Connect Redux to React
const Container = connect(mapStateToProps, mapDispatchToProps)(RandomQuote);

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
ReactDOM.render(<Presentation />, document.getElementById("root"));