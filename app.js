var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');
var routes = require('./routes');
var http = require('http');
var urlencoded = require('url');
var json = require('json');
var logger = require('logger');
var serverless = require('severless-http');
//var serveFavicon = require('serve-favicon');
var jade = require('jade');
//var pug = require('pug');
var errorhandler = require('errorhandler');
//var expressSession = require('express-session');
var methodOverride = require('method-override');
var nano = require('nano')('http://heccubernny:passcode@localhost:5984');
var db = nano.db.use('jumbo');
var app = express();

app.set("port", process.env.PORT || 3000);
app.set("views", path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(bodyParser.json({
	limit: '50mb' //limit for Json 
}));
app.use(bodyParser.urlencoded({limit: '50mb',/*limit for URL Encode(image data)*/ extended: true}));
app.use(methodOverride());
app.use(express.static(path.join(__dirname, 'public')));
app.use('./netlify/function/', app);
app.get('/', routes.index);
app.post('/createdb', (req, res)=>{
	nano.db.create(req.body.dbname, (err)=>{
		if(err){
			res.send('Error in creating Database ' + req.body.dbname);
			return;
		}
		else{
		
			res.send('Database '+req.body.dbname + ' created Successfully');
		}
	});
});

app.post('/new_contact', (req, res)=>{
	var name = req.body.name;
	var phone = req.body.phone;
	db.insert({name:name, phone:phone, crazy:true}, phone, (err, body, header)=>{
		if(err){
			res.send('Error creating Contact');
			return;
		}
		
		res.send('Contact '+req.body.dbname + 'Created Successfully');
	});
});


app.post('/view_contact', (req, res)=>{
	var alldoc = "Following Contacts";
	db.get(req.body.phone,{revs_info:true}, (err, body)=>{
		if(!err){
			console.log(body);
		}
		if(body){
			alldoc += " Name: "+body.name+"<br>"+"Phone Number: "+body.phone;
		}
		else{
			alldoc = "No records found";
		}
		res.send(alldoc);
	});
});

app.post('/delete_contact', (req, res)=>{
	db.get(req.body.phone, {revs_info:true}, (err, body)=>{
		if(!err){
			db.destroy(req.body.phone, body._rev, (err, body)=>{
				if(err){
					res.send('Error deleting contact');
				}
			});
			res.send('Contact deleted Successfully');
		}
		
		else{
			return "no such number found in the database";
		}
	});
});

http.createServer(app).listen(app.get('port'), function(){
	console.log('Express server listen on port ' + app.get('port'));});

module.exports.handler = serverless(app);