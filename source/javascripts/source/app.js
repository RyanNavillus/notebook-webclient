import loginView from "./views/login.js";
import dataEntryForm from "./forms/dataentry.js";
import pages from "./views/pages.js";

$(document).ready(function() {
	loginView.init(React, ReactDOM);
});

// Render notebooks to notebook selector
function renderNotebooks( notebooks )
{
  var htmlToRender = "";

  for (var notebook in notebooks)
  {
    htmlToRender = htmlToRender + notebook.getNootbookHTML(); 
  }

  document.getElementById("notebookSelectorView").innerHTML = htmlToRender;
}
