import React from "../lib/react.js";

import LoginView from "./views/login.js";
import Notebooks from "./views/notebooks.js";
import NotebookPages from "./views/pages.js";

import PushNotification from "./views/subviews/cosignnotification.js";

import User from "./models/user.js";
import ManagerView from "./views/manager"
import DevFeedbackView from "./views/subviews/devfeedback";
import * as Utils from "./utils.js";

class VENote extends React.Component {
	constructor(props) {
		super(props);

		if(typeof(Storage) !== "undefined" && localStorage.getItem("user_hash")) {
		    this.state = { view : "blankView", pushView : false };
        }
        else {
            this.state = { view : "", pushView : false};
        }

		this.login = this.login.bind(this);
		this.getUser = this.getUser.bind(this);

		this.notebook = this.notebook.bind(this);
		this.getNotebooks = this.getNotebooks.bind(this);
		this.setNotebooks = this.setNotebooks.bind(this);

		this.getCurrentNotebook = this.getCurrentNotebook.bind(this);

		this.back = this.back.bind(this);
		this.logout = this.logout.bind(this);

		this.parentHandler = { getUser : this.getUser, getNotebooks : this.getNotebooks, setNotebooks : this.setNotebooks,
                                getCurrentNotebook : this.getCurrentNotebook, back : this.back, logout : this.logout };
	}

    componentDidMount() {
        if(this.state.view === "blankView" && typeof(Storage) !== "undefined" && localStorage.getItem("user_hash")) {
            Utils.post("user", { user_hash : localStorage.getItem("user_hash") }, function(json) {
                this.login(json);
            }.bind(this), function(error) {
                this.setState({ view : "" });
            }.bind(this));
        }
    }

	login(responseJson) {
	    this.user = new User(responseJson.user_hash, responseJson.permissions, responseJson.company_name, responseJson.notebook_list);
	    this.notebooks = this.user.notebooks;
	    if(typeof(Storage) !== "undefined") {
	        localStorage.setItem("user_hash", this.user.user_hash);
        }
		if(this.user.permissions.role === "manager")
		{
			this.socket = new WebSocket("ws://endor-vm1.cs.purdue.edu/");

			this.socket.onopen = function() {
				this.socket.send(JSON.stringify({type : "login", user_hash : this.user}));
			}.bind(this);

			this.socket.onmessage = function(event) {
				let msg = JSON.parse(event.data);

				if(msg.type === "failed")
				{
					this.socket.close();
					this.socket = undefined;
				}
				else if(msg.type === "login")
				{
					this.socket.send(JSON.stringify({type:"testpush"}));
					setTimeout(function() {
						this.socket.send(JSON.stringify({type:"testpush"}));
					}.bind(this), 5000);
				}
				else if(msg.type === "push")
				{
					this.push_data = {notebook_hash : msg.msg.notebook_hash, entry_hash : msg.msg.entry_hash};
					this.setState({pushView : true});
				}
				console.log(event);
			}.bind(this);
		}

		this.setState({ view : "notebookView" });
	}

	getUser() {
		return this.user;
	}

	notebook(notebook) {
        this.currentNotebook = notebook;
        this.setState({ view : "pageView" });
	}

	manager() {
	    this.setState({ view : "managerView" });
    }

	getNotebooks() {
		return this.notebooks;
	}

	setNotebooks(notebooks) {
		this.notebooks = notebooks;
	}

	getCurrentNotebook() {
	    return this.currentNotebook;
	}

	back(e) {
        if(this.state.view === "pageView") {
            this.currentNotebook = undefined;
            this.setState({ view : "notebookView" });
        }
        else if(this.state.view === "managerView") {
            this.setState({ view : "pageView" });
        }
	}

	logout(e) {
        //this.user = undefined;
        this.notebooks = undefined;
        this.currentNotebook = undefined;

        if(this.socket !== undefined)
        {
            this.socket.close();
            this.socket = undefined;
        }

        if(typeof(Storage) !== "undefined") {
            localStorage.setItem("user_hash", undefined);
        }

        this.setState({view : "", pushView : false, feedbackView : false});
	}

	render() {
		return (<div id="venoteview">
			<div id="renderview">{this.state.view === "notebookView" ? <Notebooks callback={this.notebook} parentHandler={this.parentHandler}/>
				: this.state.view === "pageView" ? <NotebookPages parentHandler={this.parentHandler} /> :
					this.state.view === "managerView" ? <ManagerView parentHandler={this.parentHandler} /> :
                    this.state.view === "" ? <LoginView callback={this.login} /> : null}</div>
            <div id="feedbackview">
                {this.state.view !== "" && this.state.view !== "blankView" ? <DevFeedbackView parentHandler={this.parentHandler} /> : null}
            </div>
			<div id="pushview">
				{this.state.pushView ? <PushNotification parentHandler={this.parentHandler} data={this.push_data} /> : null}
			</div>
		</div>);
	}
}

document.addEventListener("DOMContentLoaded", function(event) {
	ReactDOM.render(<VENote view={ document.body.className } />, document.getElementById("root"));
});
