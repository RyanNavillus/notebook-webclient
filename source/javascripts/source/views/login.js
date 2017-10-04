import notebookView from "./notebooks.js";

const loginView = {

	init() {
		const body = $("body");

		const form = $("<div class='form-container form-style login' style='display:none;'>" +
							"<form method='post'>" +
								"<div class='form--label'><img src='./images/logo.png' alt='VENote' class='login--logo-image' width='600'/></div>" +
								"<div class='form--text login--id'><input name='email' type='text' placeholder='Email' data-required></div>" +
								"<div class='form--text login--id'><input name='password' type='password' placeholder='Password' data-required><a id='badlogin' style='display:none'>Your email/password was incorrect</a></div>" +
								"<div class='form--text register--id' style='display:none;'><input name='confirmpassword' type='password' placeholder='Confirm Password' data-required></div>" +
								"<div class='form--text register--id' style='display:none;'><input name='companyid' type='number' placeholder='Company ID' data-required></div>" +
								"<div id='loginbutton' style='padding-right:10px; width:50%; margin-left:0; margin-right:0; float:left'>" +
									"<button type='submit' title='Login' class='login button button--primary button--normal' style='background:forestgreen; margin-top:20px'>" +
										"<span>Login</span>" +
									"</button>" +
								"</div>" +
								"<div class='form--third' id='recoverbutton'>" +
									"<button type='submit' title='Recover' class='recover button button--primary button--normal' style='background:orange; margin-top:20px; display:none'>" +
										"<span>Recover</span>" +
									"</button>" +
								"</div>" +
								"<div id='registerbutton' style='padding-left:10px; margin-right:0; margin-left:0; float:right; width:50%'>" +
									"<button type='submit' title='Register' class='register button button--primary button--normal' style='background:indianred; margin-top:20px'>" +
										"<span>Register</span>" +
									"</button>" +
								"</div>" +
							"</form>" +
						"</div>");

		body.append(form);

		form.show(500);

		const loginfields = body.find(".login--id");
		const badlogin = loginfields.find("#badlogin");
		const registerfields = body.find(".register--id");

		const loginbutton = body.find("#loginbutton");
		const recoverbutton = body.find("#recoverbutton");
		const registerbutton = body.find("#registerbutton");

		let loginMode = 0;

		badlogin.on("click", function(e) {
			$(this).hide(300);
			loginMode = 2;
			loginfields.last().hide(300);
			loginbutton.animate({'padding-right':'13px', 'width':'33%'}, 150);
			registerbutton.animate({'padding-left':'13px', 'width':'33%'}, 150, function() {
				recoverbutton.children().show(300);
			});
			e.preventDefault();
		});

		$("button[type='submit']").on("click", function(e) {
			if($(this).attr("title") === "Recover" && loginMode === 2)
			{
				//RECOVER ACCOUNT HERE
			}
			else
			{
				if(loginMode === 2)
				{
					recoverbutton.children().hide(150, function() {
						registerbutton.animate({'padding-left':'10px', 'width':'50%'}, 300);
						loginbutton.animate({'padding-right':'10px', 'width':'50%'}, 300);
					});
				}
				if($(this).attr("title") === "Register")
				{
					if(loginMode === 0 || loginMode === 2)
					{
						loginMode = 1;
						loginfields.show(300);
						badlogin.hide();
						registerfields.show(300);
					}
					else
					{
						//REGISTER ACCOUNT HERE
					}
				}
				else if($(this).attr("title") === "Login")
				{
					if(loginMode > 0)
					{
						loginMode = 0;
						loginfields.show(300);
						registerfields.hide(300);
					}
					else
					{
						let random = Math.random();
						if(random < .5)
							badlogin.show(300);
						else
						{
							body.find(".form-container").hide(500, function() {
							   body.html('');
							   notebookView.init();
							});
						}
					}
				}
			}
			e.preventDefault();
		});
	}
};

export * from  "../forms/form.js";
export default loginView;
