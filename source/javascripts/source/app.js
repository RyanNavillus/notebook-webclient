import loginView from "./views/login.js";
import dataEntryForm from "./forms/dataentry.js";
import pages from "./views/pages.js";

$(document).ready(function() {
	loginView.init(React, ReactDOM);
});

// Models
var Page = function(){};
Page.prototype = 
{
  id: null,
  signiture: null,
  creator: null,
  timestamp: null
};

var Notebook = function(){};
Notebook.prototype = 
{
  id: "ThisIsID",
  pages: null,
  creator: null,
  timestamp: null,
  getNotebookHTML = function()
  {
    return "<div class=\"notebookHolder\"><p>" + id + " </p></div>"
  }
};

function renderNotebooks( notebookList )
{
  var htmlToRender = "";
  for (var notebook in notebooks)
  {
    htmlToRender = htmlToRender + notebook.getNootbookHTML(); 
  }
  document.getElementById("notebookSelectorView").innerHTML = htmlToRender;
}

//Example of how to make a 'class' and instantiate an object
var myClass = function(){};
myClass.prototype = {
    someProperty: null,
    someOtherProperty: 0,

    doSomething: function (msg) {
      this.someProperty = msg;
      alert(this.someProperty);
    }
};

var myClassObj = new myClass();
myClassObject.doSomething("Hello World");
	const body = $("body");
	if(body.hasClass("pageview"))
	{
		pages.init();
	}
	if(body.hasClass("dataEntryView"))
	{
		dataEntryForm.init(document.getElementById("root"));
	}
	else
	{
		loginView.init();
	}
});
