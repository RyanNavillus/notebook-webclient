import React from "../../../lib/react.js";

import * as Utils from "../../utils.js";
import QueryView from "./query"

export default class ToolbarView extends React.Component {
	constructor(props) {
		super(props);

		this.parent = props.parentHandler;
		this.name = props.page;
		this.hasBack = props.hasBack;
    this.hasShare = props.hasShare;
    this.dataIntro = props.dataIntro;
    this.dataStep = props.dataStep;

		this.state = { toolbarState : "stateLoad ", searchBarState : "stateHide " };

		this.toggleSearchBar = this.toggleSearchBar.bind(this);
    this.shareCallback = this.shareCallback.bind(this);
		this.testButton = this.testButton.bind(this);
	}

	componentDidMount() {
        setTimeout(function() {
            this.setState({toolbarState: "stateLoad stateTransition "});
            setTimeout(function() {
                this.setState({toolbarState: ""});
            }.bind(this), 300);
        }.bind(this), 300);
    }

    componentWillReceiveProps(nextProps) {
	    if(nextProps.visible !== this.props.visible)
	        this.setState({ toolbarState : "stateExit stateTransition " });
    }

    testButton() {
	console.log("Search Initiated");	
	// Incomplete - needs testing
        fetch('PLACEHOLDER_URL', {
                method: 'POST',
                headers: {
			'Accept': 'application/json',
	                'Content-Type': 'appication/json'
		},
		body: ""
        });
    }

    toggleSearchBar(event) {
	    this.setState({ searchBarState : Utils.showHide(this.state.searchBarState) });
    }

    shareCallback(event) {
      prompt("Your share link -->", "http://myexamplesharenoteisthis");
    }

	render() {
		return (<div {(this.dataIntro && this.dataStep) ? {"data-intro" : this.dataIntro, "data-step" : this.dataStep} : {}} className={this.state.toolbarState}>
			{this.hasBack === true ? <a className="toolbar--back" href="#" onClick={e => (this.testButton, this.parent.backCallback(e))} /> : null}
			<div className="toolbar--title">
				{this.name}
			</div>
			<div className="toolbar--right-icons">
				{this.hasShare === true ? <a className="toolbar--share" href="#" onClick={e => (e.preventDefault(), this.shareCallback(e))}/> : null}
				<a className="toolbar--search" href="#" onClick={e => (e.preventDefault(), this.query_input.showQueryInput())} />
				<a className="toolbar--logout" href="#" onClick={e => (e.preventDefault(), this.parent.logoutCallback(e))} />
			</div>
			<QueryView ref={query => (this.query_input = query)}/>
		</div>);
	}
}
