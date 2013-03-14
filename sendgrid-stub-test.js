/*
Test the SendGrid stub
*/

var should = require('should');
var stub = require('./sendgrid-stub.js');
var async = require('async');

describe("The SendGrid stub", function(){
	var sendgrid;
	var mailclient;

	beforeEach(function(done){
		sendgrid = new stub.SendGrid(null, null, true);
		mailclient = new stub.MailClient();
		done();
	})

	afterEach(function(done){
		mailclient.deleteAll(done);
	})

	it("can send e-mail and the client can read it", function(done){
		var delay = 0; // Seems to not need a delay
		var email = {test: "Ooh yes"};
		async.series(
			[function(complete){
				setTimeout(function() {
					complete(null);
				}, delay);
			},
			function(complete){
				sendgrid.send(email,
					function(success, message){
				 		if(success)
				 			complete()
				 		else
				 			complete(message)
				 	});	
			},
			function(complete){
				setTimeout(function() {
					complete(null);
				}, delay);
			},
			function(complete){
				mailclient.getLatest(function(err, data){
					should.not.exist(err)
					JSON.parse(data).should.eql(email);
					complete();
				})
			}
			],
			function(err){
				done(err);
			} 
		)
		
	})

	it("can send e-mails and the client can read them", function(done){
		var delay = 50; // Seems to not need a delay
		var email = {test: "Ooh yes"};
		async.series(
			[function(complete){
				setTimeout(function() {
					complete(null);
				}, delay);
			},
			function(complete){
				sendgrid.send(email,
					function(success, message){
				 		if(success)
				 			complete()
				 		else
				 			complete(message)
				 	});	
			},
			function(complete){
				setTimeout(function() {
					complete(null);
				}, delay);
			},
			function(complete){
				sendgrid.send(email,
					function(success, message){
				 		if(success)
				 			complete()
				 		else
				 			complete(message)
				 	});	
			},
			function(complete){
				setTimeout(function() {
					complete(null);
				}, delay);
			},
			function(complete){
				mailclient.getAll(function(err, data){
					(data.length == 2).should.be.true
					complete(err);
				})
			}
			],
			function(err){
				done(err);
			} 
		)
		
	})

	it("Client can read emails even when there are none", function(done){
		var delay = 10; // Seems to not need a delay
		var email = {test: "Ooh yes"};
		async.series(
			[function(complete){
				setTimeout(function() {
					complete(null);
				}, delay);
			},
			function(complete){
				mailclient.getLatest(function(err, data){
					should.not.exist(err)
					should.not.exist(data)
					complete(err);
				})
			}
			],
			function(err){
				done(err);
			} 
		)
		
	})
})