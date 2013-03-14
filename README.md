sendgrid-stub
=============

A node.js stub for the SendGrid library - this lets you send and receive emails locally during testing

Usage
-----
Install
    
    npm install sendgrid-stub
Use
    
    var MailClient = require('sendgrid-stub').MailClient;
    var SendGrid = require('sendgrid-stub').SendGrid;
    var localAppserverMailClient = new MailClient("./sendgridEmails/");
    var sendgrid = new SendGrid("username", "password");

    //Send the email
    sendgrid.send({
		to: "receiver@example.com",
		from: "hello@example.com",
		subject: "Test mail",
		html: "<b>Content</b>"
		text: "Content"
	}, callback);

	//Receive it again
	localAppserverMailClient.getLatest(function(err, email){
		console.log(email);
	}

	//Purge inbox
	localDashboardMailClient.deleteAll(function(){
		console.log("Deleted")
	})

Background
----------
I use this mock for testing webapps which make use of the SendGrid service. Just replace the sendgrid library with this stub, and pick up your e-mails with the mail client from: process.cwd()+"/sendgridEmails/"

All emails are written to disk as json objects.