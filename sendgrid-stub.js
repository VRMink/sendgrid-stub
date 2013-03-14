var fs = require('fs');
var _ = require('underscore');

/*
SendGrid Stub
*/

function SendGrid(user, pass, silence){
	var mailDestination = process.cwd()+"/sendgridEmails/";
	if(!silence)
		console.log("SendGrid Stub initialized, mails go to " + mailDestination)

	this.serializeEmail = function(email, callback){
		//Create mail destination path
		try{
			fs.mkdirSync(mailDestination)
		}
		catch(err)
		{} //Do nothing if the directory already exists

		// Write new file names after timestamp
		fs.writeFile(
			mailDestination+Date.now()+".json",
		 	JSON.stringify(email),
		 	'utf8',
		 	function(err){ // Have to do a custom callback since SendGrid don't follow convention
		 		if(err)
		 			callback(false, err)
		 		else
		 			callback(true, null)
		 	});
	}

	/*
	 * Sends an email via REST and returns true if the
	 * message was sent successfully.
	 *
	 * @param    {Email|Object}  email     An email object or a hash that has
	 *                                    the values for the email to be sent.
	 * @param    {Function}      callback  A function to call when the processing is done.
	 */

	this.send = function(email, callback) {
		this.serializeEmail(email, callback)
	};

	/*
	 * Sends an email via SMTP and returns true if the
	 * message was sent successfully.
	 *
	 * @param    {Email|Object}  email     An email object or a hash that has
	 *                                     the values for the email to be sent.
	 * @param    {Function}      callback  A function to call when the processing is done.
	 */
	this.smtp = function(email, callback) {
		this.serializeEmail(email, callback)
	};
};



module.exports.SendGrid = SendGrid;

/*
Stub Mail client to read emails sent
*/

function MailClient(mailDest){
	var mailDestination = process.cwd()+"/sendgridEmails/";
	if(mailDest)
		mailDestination = process.cwd()+"/"+mailDest;
	//Create mail destination path, to make sure it is there
	try{
		fs.mkdirSync(mailDestination)
	}
	catch(err)
	{} //Do nothing if the directory already exists

	//callback(err, data)
	this.getLatest = function(callback){
		fs.readdir(mailDestination, function(err, fileNames){
			if(err || fileNames.length < 1)
				callback(null, null);
			else
				fs.readFile(mailDestination+_.last(fileNames), 'utf8', callback);
		});
	}

	//callback(err, data) called n times
	this.getAll = function(callback){
		fs.readdir(mailDestination, function(err, fileNames){
			var all = _.map(fileNames, function(element, index, list){
				return fs.readFileSync(mailDestination+element, 'utf8');
			})
			callback(null, all)
		})
	}

	//callback(err) called on completion
	this.deleteAll = function(callback){
		try{
			var fileNames = fs.readdirSync(mailDestination);
			_.each(fileNames, function(element, index, list){
				fs.unlinkSync(mailDestination+element);
			})	
			fs.rmdir(mailDestination, callback);
		}catch(err){
			// We don't mind that the directory could not be deleted, 
			// it is usually because it was already removed by another call.
			callback();
		}
	}
}

module.exports.MailClient = MailClient; 