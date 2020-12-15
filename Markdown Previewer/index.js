"use strict";
import React from "react";
import ReactDOM from "react-dom";
import { createStore } from "redux";
import { Provider } from "react-redux";
import { connect } from "react-redux";
import "./style.scss";
import defaultVal from "./default";

//Redux Store
const ALTER = "ALTER";
const JUST_EDITOR = "JUST_EDITOR";
const JUST_PREVIEWER = "JUST_PREVIEWER";
const BOTH = "BOTH";
const defaultState = {
    content: defaultVal,
    editor: true,
    previewer: true
};
const markDownReducer = (state = defaultState, action) => {
    switch(action.type) {
        case ALTER: 
            return {
                content: action.content,
                editor: state.editor,
                previewer: state.previewer
            };
        case JUST_EDITOR:
            return {
                content: state.content,
                editor: true,
                previewer: false
            };
        case JUST_PREVIEWER:
            return {
                content: state.content,
                editor: false,
                previewer: true
            };
        case BOTH:
            return {
                content: state.content,
                editor: true,
                previewer: true
            };
        default:
            return state;
    }
};
const alterAction = (content) => {
    return {
        type: ALTER,
        content: content
    };
};
const justEditorAction = () => {
    return {
        type: JUST_EDITOR
    };
};
const justPreviewerAction = () => {
    return {
        type: JUST_PREVIEWER
    };
};
const bothAction = () => {
    return {
        type: BOTH
    };
};
const store = createStore(markDownReducer);
store.subscribe(() => console.log(store.getState()));

//React Component
class MarkdownPreviewer extends React.Component {
    constructor(props) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
        this.handleClickEditor = this.handleClickEditor.bind(this);
        this.handleClickPreviewer = this.handleClickPreviewer.bind(this);
    }
    handleChange(event) {
        this.props.alterState(event.target.value);
    }
    getMarkDownText() {
        var preMarked = this.props.stage.content.replace(/\\n/g, "<br />");
        var markedDown = marked(preMarked);
        return { __html: markedDown };
    }
    handleClickEditor() {
        if(this.props.stage.previewer == false) {
            this.props.both();
            $("#editor").removeClass("maximized");
        } else if(this.props.stage.previewer == true) {
            this.props.justEditor();
            $("#editor").addClass("maximized");
        }
        console.log("Clicked Editor!!");
    }
    handleClickPreviewer() {
        if (this.props.stage.editor == false) {
            this.props.both();
            $("#previewer").removeClass("maximized");
        } else if (this.props.stage.editor == true) {
            this.props.justPreviewer();
            $("#previewer").addClass("maximized");
        }
        console.log("Clicked Previewer!!");
    }
    render() {
        var editorStyle = {
            display: "block"
        }; 
        var previewerStyle = {
            display: "block"
        };
        var clickImg = <i className="fa fa-arrows-alt"></i>;
        if(this.props.stage.editor == true && this.props.stage.previewer == false) {
            previewerStyle = {
                display: "none"
            }; 
            clickImg = <i className="fa fa-compress" />;
        } else if (this.props.stage.editor == false && this.props.stage.previewer == true) {
            editorStyle = {
                display: "none"
            }; 
            clickImg = <i className="fa fa-compress" />;
        }
        return (
            <div>
                <div id="editor" className="editor" style={editorStyle}>
                    <header id="editor-header">
                        <i className="fa fa-cannabis"></i>
                        <span id="text">Editor</span>
                        <span className="clicker" onClick={this.handleClickEditor}>
                            {clickImg}
                        </span>
                    </header>
                    <textarea id="text-area" className="work-area" value={this.props.stage.content} onChange={this.handleChange} />
                </div>
                <div id="previewer" className="previewer" style={previewerStyle}>
                    <header id="editor-header">
                        <i className="fa fa-cannabis"></i>
                        <span id="text">Previewer</span>
                        <span className="clicker" onClick={this.handleClickPreviewer}>
                            {clickImg}
                        </span>
                    </header>
                    <div id="view-area" className="work-area" dangerouslySetInnerHTML={this.getMarkDownText()} />
                </div>
            </div>
        );
    }
}

//Match state, dispatch to props
const mapStateToProps = (state) => {
    return {
        stage: state
    };
};
const mapDispatchToProps = (dispatch) => {
    return {
        alterState: (content) => {
            dispatch(alterAction(content));
        },
        justEditor: () => {
            dispatch(justEditorAction());
        },
        justPreviewer: () => {
            dispatch(justPreviewerAction());
        },
        both: () => {
            dispatch(bothAction());
        }
    };
}; 

//Connect Redux to React
const Container = connect(mapStateToProps, mapDispatchToProps)(MarkdownPreviewer);

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
};

ReactDOM.render(
  <Presentation />,
  document.getElementById("root")
);