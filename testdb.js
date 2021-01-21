var nano = require('nano')('http://heccubernny:passcode@localhost:5984'), 
	username = 'heccubernny', 
	userpass = 'passcode', 
	callback = console.log // this would normally be some callback,
	cookies  = {} // store cookies, normally redis or something
  ;;
var alice = nano.db.use('alice');
var fs = require('fs');
  nano.auth(username, userpass, function (err, body, headers) {
  if (err) {
    return callback(err);
  }

  if (headers && headers['set-cookie']) {
    cookies[user] = headers['set-cookie'];
  }

  callback(null, "it worked");
});
 
fs.readFile('rabbit.png', function(err, data) {
  if (!err) {
    alice.multipart.insert({ foo: 'bar' }, [{name: 'rabbit.png', data: data, content_type: 'image/png'}], 'mydoc', function(err, body) {
        if (!err)
          console.log(body);
    });
  }
});
var auth = "some stored cookie"
  , callback = console.log // this would normally be some callback
  , alice = require('nano')(
    { url : 'http://localhost:5984/alice', cookie: 'AuthSession=' + auth });
  ;

alice.insert({crazy: true}, 'rab', function (err, body, headers) {
  if (err) {
    return callback(err);
  }

  // change the cookie if couchdb tells us to
  if (headers && headers['set-cookie']) {
    auth = headers['set-cookie'];
  }

  callback(null, "it worked");
});


var nano = require('nano')({url: 'http://localhost:5984', cookie: 'AuthSession=' + auth});

nano.session(function(err, session) {
  if (err) {
    return console.log('oh noes!')
  }

  console.log('user is %s and has these roles: %j',
    session.userCtx.name, session.userCtx.roles);
});