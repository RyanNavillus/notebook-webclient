import React from "../../lib/react.js";

import Notebook from "../models/notebook.js";

import ToolbarView from "./subviews/toolbar.js";
import NotebookView from "./subviews/notebook.js";

import CreateNotebookForm from "./forms/createnotebook.js";

import * as Utils from "../utils.js";

export default class NotebooksView extends React.Component {
	constructor(props) {
		super(props);

		this.parent = props.parentHandler;
		this.callback = props.callback;

		this.state = { notebookList : [], close : false, notebookState : "stateLoad " };

		this.notebookSearch = this.notebookSearch.bind(this);

		this.register = this.register.bind(this);

		this.manager = this.manager.bind(this);

		this.openNotebook = this.openNotebook.bind(this);

		this.logout = this.logout.bind(this);

        this.parentToolbar = { backCallback : this.parent.back, logoutCallback : this.logout, user_hash : this.parent.getUser().user_hash, query : this.notebookListSearch, manager : this.manager };
        this.parentNotebook = { openNotebook : this.openNotebook };
	}

	componentDidMount() {
		let notebookCount = this.parent.getUser().notebooks.length;
		const notebooks = [];

		let flag = false;

        setTimeout(function() {
                this.setState({ notebookState: "stateLoad stateTransition " });

                setTimeout(function() {
                    if(this.state.notebookState === "stateLoad stateTransition ")
                        this.setState({ notebookState: "" });

                }.bind(this), 300);
        }.bind(this), 300);

		this.parent.getUser().notebooks.forEach(function(notebook_uuid) {

			Utils.post("getNotebook", { user_hash : this.parent.getUser().user_hash, notebook_hash : notebook_uuid }, function(json) {

				flag = true;

				notebooks.push(new Notebook(notebook_uuid, json));

				notebooks.sort(function(n1, n2) {
				    return n2.date_modified_real - n1.date_modified_real;
                });

				this.setState({ notebookList : notebooks.slice() });

				notebookCount--;
				if(notebookCount === 0)
					this.parent.setNotebooks(notebooks);

			}.bind(this));

		}.bind(this));

		if(!flag) {
			this.setState({ notebookList : this.parent.getNotebooks() });
		}
	}

    notebookSearch(responseJson) {
	for (let entry of openNotebook.dataEntries) {
		console.log(entry);
	}
	console.log("notebookListSearch");
	fetch("http://endor-vm1.cs.purdue.edu/searchByText", {
	    method: "POST",
	    headers: {
		    "Accept": "application/json",
		    "Content-Type": "application/json"
	    },
	    body: JSON.stringify({
		    user_hash : this.parent.getUser(),
		    notebook_hash : this.openNotebook.notebook_hash,
		    entry_hash: this.openNotebook,
		    text: ""
	    })
	}).then(function(response) {
		if(response.ok) {
			return response.json();
		}
		throw new Error("Network response was not ok.");
	});
    }

    manager() {

    }

    register(responseJson) {
	    const notebooks = this.state.notebookList;

	    notebooks.push(new Notebook(responseJson.notebook_hash, responseJson));

        notebooks.sort(function(n1, n2) {
            return n2.date_modified_real - n1.date_modified_real;
        });

	    this.setState({ notebookList: notebooks });
	    this.parent.getUser().permissions.notebooks[responseJson.notebook_hash] = { read : true, write : true, manager : true };
	    this.parent.setNotebooks(this.state.notebookList);
    }


    openNotebook(notebook) {
        this.create_notebook.hideCreateNotebook();
	    this.setState({ notebookState : "stateExit stateTransition ", close : true });

	    setTimeout(function(){
		    this.callback(notebook);
	    }.bind(this), 300);
    }

    logout(event) {
	    this.create_notebook.hideCreateNotebook();
	    this.setState({ notebookState : "stateExit stateTransition ", close : true });

	    setTimeout(function(){
            this.parent.logout(event);
        }.bind(this), 300);
    }

	render() {
		return (<div className="notebooks-view">
			<ToolbarView dataIntro="Click the Magnifying glass to search. Click the button to it's right to logout" dataStep="3"
                         page={this.parent.getUser().company_name} parentHandler={this.parentToolbar} visible={this.state.close}
                         query={true} isManager={this.parent.getUser().permissions.role === "admin"} />
            <div data-intro="Click on an existing notebook to add or view data entries inside" data-step="2" className={this.state.notebookState + "list-view"}>
	            {this.parent.getUser().permissions.create_notebooks ?
	            <div data-intro="Click to create a new notebook" data-step="1" className="notebooks--notebook create" onClick={() => {
	                if(this.parent.getUser().permissions.create_notebooks)
	                    this.create_notebook.showCreateNotebook();
                }}>
		            <div className="create-icon" />
	            </div> : null}
                <div className="notebooks--notebook-list">
                    {this.state.notebookList.map(notebook => (
                        <NotebookView parentHandler={this.parentNotebook} notebook={notebook} visible={this.state.close} key={notebook.notebook_hash}/>
                    ))}
                </div>
            </div>
            <CreateNotebookForm user_hash={this.parent.getUser().user_hash} submitCallback={this.register} ref={form => (this.create_notebook = form)} />
      <a className="intro-btn" href="#" onClick={e => (e.preventDefault(), introJs().start())} />
		</div>);
	}
}

