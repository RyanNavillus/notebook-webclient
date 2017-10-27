import * as form from "./form.js";
import DataEntryModel from '../models/dataentry.js';
export * from "./form.js";

export default class DataEntryForm extends React.Component {
	constructor(props) {
		super(props);
		this.state = {};
		this.dataEntry = new DataEntryModel("", "", "", "", "");
		this.submitCallback = props.submitCallback;
		this.cancelCallback = props.cancelCallback;
		this.author = props.author;
	}

	render() {
		return <div className="data-form" id="container">
				<div className="data-form" id="data-entry-header">
					<h1 className="data-form" id="header-text">Create new entry</h1>
					<input className="data-form" id="cancel-button" type="button" value="Cancel" onClick={this.cancelCallback}/>
				</div>
				<DataEntryFields dataEntry={this.dataEntry} submitCallback={this.submitCallback} author={this.author}/>
			</div>
	}
}

class DataEntryFields extends React.Component {
	constructor(props) {
		super(props);
		this.state = {hasImage: false, file: [], imgSrc: null};
		this.fileSelected = this.fileSelected.bind(this);
		this.dataEntry = props.dataEntry;
		this.submitPage = this.submitPage.bind(this);
		this.fileSelected = this.fileSelected.bind(this);
		this.submitCallback = props.submitCallback;
		this.author=props.author;
	}
	
	// Select file from image selector
	fileSelected(input) {
		console.log("File Selected:");
		console.log(input.target.value);
		if (input.target.value) {
			var file = this.refs.file.files[0];
			var reader = new FileReader();
			reader.onloadend = function (e) {
				this.dataEntry.image = reader.result;
				this.setState({
					imgSrc: [reader.result]
				})
			}.bind(this);
			var url = reader.readAsDataURL(file);
		}
	}

	// submit page to api
	submitPage() {
		var checkbox = document.getElementById("checkbox");
		if (!checkbox.checked)
		{
			alert("You must check the box before submitting.");
			return;
		}
		console.log(this.dataEntry);
		this.dataEntry.text = document.getElementById("text-box").value;
		this.dataEntry.caption = document.getElementById("caption-box").value;
		this.dataEntry.date_created = new Date();
		this.dataEntry.tags = document.getElementById("tag-box").value;
		this.dataEntry.author = "Author";
		//Need to set author

		console.log(this.dataEntry);
		fetch('PLACEHOLDER_URL', {
			method: 'POST',
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'appication/json'
			},
			body: this
		});


		if (this.submitCallback) {
			this.submitCallback(this.dataEntry);
		}

		// Clear form for future use
		document.getElementById("text-box").value = "";
		document.getElementById("caption-box").value = "";
		document.getElementById("tag-box").value = "";
		document.getElementById("checkbox").checked = false;
		this.dataEntry = new DataEntryModel("", "", "", "", "");
	}

	render() {
		return (<div className="data-form" id="form-div">
				<form className="data-form" id="form">
					<TextInput label="Describe your work:" />
					Include an image:<br />
					<input type="file" ref="file" className="data-form" id="image-upload" accept="image/*" onChange={(event)=>{this.fileSelected(event)}} /><br />
					<img className="data-form" id="image" src={this.state.imgSrc} /><br />
					Caption the image:<br />
					<textarea className="data-form" id="caption-box"></textarea><br /><br />

					Add image tags:<br />
					(Write tags as a comma separated list, for example: "Wheels, Drive Train, Movement")<br />
					<textarea className="data-form" id="tag-box"></textarea><br /><br />
					<label>	
						<input className="data-form" id="checkbox" type="checkbox" value="Hi"/>
						By checking this you confirm the accuracy of this entry.<br /><br />
					</label>
					<input className="data-form" id="submit-button" type="button" value="Submit" onClick={this.submitPage} /><br /><br />
				</form>
			</div>);	
	}
}


class TextInput extends React.Component {
	constructor(props) {
		super(props);
	}
	
	render() {
		<div>
			{props.label}<br />
			<textarea className="data-form" id="text-box"></textarea><br /><br />
		</div>

	}
}

class ImageInput extends React.Component {
	constructor(props) {
		super(props);
	}
	
	render() {

	}
}

class SubmitButton extends React.Component {
	constructor(props) {
		super(props);
	}
	
	render() {

	}
}
