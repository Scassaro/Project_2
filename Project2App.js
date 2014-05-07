// Module dependencies

var express    = require('express'),
    mysql      = require('mysql');
    ejs        = require('ejs');

// Application initialization

var connection = mysql.createConnection({
        host     : 'cwolf.cs.sonoma.edu',
        user     : 'scassaro',
        password : '3699883'
    });
    
var app = module.exports = express.createServer();

// Database setup

connection.query('CREATE DATABASE IF NOT EXISTS scassaro', function (err) {
    if (err) throw err;
    connection.query('Use scassaro', function (err) {
        if (err) throw err;
        connection.query('CREATE TABLE IF NOT EXISTS Vehicle1('
            + 'id INT NOT NULL AUTO_INCREMENT,'
            + 'PRIMARY KEY(id),'
            + 'name VARCHAR(30),'
			+ 'make VARCHAR(30),'
			+ 'model VARCHAR(30),'
			+ 'year YEAR,'
			+ 'value INT'
            +  ')', function (err) {
                if (err) throw err;
            });
		connection.query('CREATE TABLE IF NOT EXISTS Comments('
			+ 'id INT NOT NULL AUTO_INCREMENT,'
			+ 'PRIMARY KEY(ID),'
			+ 'name VARCHAR(30),'
			+ 'email VARCHAR(60),'
			+ 'comment VARCHAR(355)'
			+ ')', function (err) {
				if (err) throw err;
			});
		connection.query('CREATE TABLE IF NOT EXISTS EmailList('
			+ 'id INT NOT NULL AUTO_INCREMENT,'
			+ 'PRIMARY KEY(ID),'
			+ 'name VARCHAR(30),'
			+ 'email VARCHAR(60)'
			+ ')', function (err) {
				if (err) throw err;
			});
		connection.query('CREATE TABLE IF NOT EXISTS Reviews('
			+ 'id INT NOT NULL AUTO_INCREMENT,'
			+ 'PRIMARY KEY(ID),'
			+ 'name VARCHAR(30),'
			+ 'make VARCHAR(30),'
			+ 'model VARCHAR(30),'
			+ 'year YEAR,'
			+ 'review VARCHAR(1000)'
			+ ')', function (err) {
				if (err) throw err;
			});
    });
});

// Configuration

app.use(express.bodyParser());
app.use(express.static(__dirname + '/public'));
app.set('subtitle', 'Lab 18');
//app.set('view engine', 'ejs');

// Main route sends our HTML file

app.get('/', function(req, res) {
    res.sendfile(__dirname + '/Project2Main.html');
});


// Other Pages

app.get('/Project2EnterVehicle.html', function(req, res) {
    res.sendfile(__dirname + '/Project2EnterVehicle.html');
});

app.get('/Project2About.html', function(req, res) {
    res.sendfile(__dirname + '/Project2About.html');
});

// Set up Views

//app.set('views',__dirname + '/views');

// Update MySQL database

app.post('/enter', function (req, res) {
    connection.query('INSERT INTO Vehicle1 SET ?', req.body, 
        function (err, result) {
             if (err) throw err;
            res.send('Vehicle added to database with Owner Name: ' + req.body.name + ' Vehicle Make: ' + req.body.make + ' Vehicle Model: ' + req.body.model + ' Vehicle Year: ' + req.body.year + 'Value: ' + req.body.value);
        }
    );
});

// Enter Reviews

app.post('/review/enter', function (req, res) {
	connection.query('Insert INTO Reviews SET ?', req.body,
		function (err, result) {
			if (err) throw err;
			res.send('Thank you for submitting you review, ' + req.body + '.');
		}
	);
});

// Update comments and mailing list.

app.post('/entercomment', function(req, res) {
	connection.query('INSERT INTO Comments SET ?', req.body,
		function (err, result) {
			if (err) throw err;
			res.send('Thank you ' + req.body.name + '! Someone will contact your shortly regarding your submission.');
			}
		);
	connection.query('INSERT INTO EmailList SET name = ?', req.body.name, ',& email = ?', req.body.email,
		function (err, result) {
			if (err) throw err;
			}
		);
});

// Retrieving tables.

app.get('/vehicle/table', function (req, res) {
    connection.query('select * from Vehicle1',
	function (err, result) {
	    if(result.length > 0) {
		var responseHTML = '<html><head><title>All Vehicles</title><link a href="/default.css" rel="stylesheet"></head><body>';
		responseHTML += '<div class="title">All Vehicles</div>';
		responseHTML += '<table class="vehicles"><tr><th class="rightalign">Name</th><th>Vehicle Make</th><th>Vehicle Model</th><th>Vehicle Year</th><th>Value</th></tr>';
		for(var i = 0; result.length > i; i++) {
		    responseHTML += '<tr>' +
			'<td><a href="/users/?id=' + result[i].id + '"></a>' + result[i].name + '</td>' + 
			'<td>' + result[i].make + '</td>' + 
			'<td>' + result[i].model + '</td>' + 
			'<td>' + result[i].year + '</td>' + 
			'<td>' + result[i].value + '</td>' +
			'</tr>';
		}
		responseHTML += '</table>';
		responseHTML += '</body></html>';
		res.send(responseHTML);
	    }
	    else
		res.send('No users exist.');
	}
		    );
});

app.get('/review/table', function (req, res) {
    connection.query('select * from Reviews',
	function (err, result) {
	    if(result.length > 0) {
		var responseHTML = '<html><head><title>All Reviews</title><link a href="/default.css" rel="stylesheet"></head><body>';
		responseHTML += '<div class="title">All Reviews</div>';
		responseHTML += '<table class="vehicles"><tr><th class="rightalign">Name</th><th>Vehicle Make</th><th>Vehicle Model</th><th>Vehicle Year</th><th>Review</th></tr>';
		for(var i = 0; result.length > i; i++) {
		    responseHTML += '<tr>' +
			'<td><a href="/users/?id=' + result[i].id + '"></a>' + result[i].name + '</td>' + 
			'<td>' + result[i].make + '</td>' + 
			'<td>' + result[i].model + '</td>' + 
			'<td>' + result[i].year + '</td>' + 
			'<td>' + result[i].review + '</td>' +
			'</tr>';
		}
		responseHTML += '</table>';
		responseHTML += '</body></html>';
		res.send(responseHTML);
	    }
	    else
		res.send('No users exist.');
	}
		    );
});

// Populate Select
app.post('/vehicle/select', function (req, res) {
    console.log(req.body);
    connection.query('select * from Vehicle1',
	function (err, result) {
	    console.log(result);
	    var responseHTML = '<select id="vehicle-list">';
	    for (var i=0; result.length > i; i++) {
		var option = '<option value="' + result[i].id + '">' + result[i].name + '</option>';
 		console.log(option);
		responseHTML += option;
	    }
	    responseHTML += '</select>';
	    res.send(responseHTML);
	});
});

// Return info for select
app.get('/vehicle/', function (req, res) {
    console.log(req.body);
    //if(typeof req.query.id != 'undefined') {
	connection.query('select * from Vehicle1 where id = ?', req.query.id,
			 function (err, result) {
			     console.log(result);
			     if(result.length > 0) {
				 var responseHTML = '<html><head><title>All Vehicles</title><link a href="/default.css" rel="stylesheet"></head><body>';
				 responseHTML += '<div class="title">Vehicle for' + result[0].name + '</div>';
				 responseHTML += '<table> class="users"><tr><th>ID</th><th>Make</th><th>Model</th><th>Year</th></tr>';
				 responseHTML += '<tr><td>' + result[0].id + '</td>' +
		                     '<td>' + result[0].make + '</td>' +
		                     '<td>' + result[0].model + '</td>' +
		                     '<td>' + result[0].year + '</td>' +
							 '<td>' 
		                     '</tr></table>';
				 responseHTML += '</body></html>';
				 res.send(responseHTML);
			     }
			     else
				 res.send('User does not exist.');
			 }
			)/*}*/;
    /*else if(typeof req.query.username != 'undefined') {
	connection.query('select * from Vehicle where name = ?', req.query.name,
		function (err, result) {
		    console.log(result);
		    if(result.length > 0) {
			res.send('Username: ' +*/
});
    

// Stuff for Lab 18 VIEWS!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

/*app.get('/users', function(req, res) {
    var result = [
	{UserID: 1, Email: 'Test'},
	{UserID: 2, Email: 'Test2'}
];
    res.render('displayUserTable.ejs', {rs: result});
});


app.get('/first',  function(req, res) {
    connection.query('select model from Vehicle1 where make="Chevy"',
		     function (err, result){
			 if(result.length > 0)
			     var content = [
				 {Model: result.model}
				 ];
			 res.render('lab18first.ejs', {rs: content});
		     });
});

app.get('/second',  function(req, res) {
    res.render('lab18second.ejs')
});*/

// Use app.js to view a file (uSING VIEWS)

app.get('/lab18', function(req, res) {
    res.render('lab18');
    }
);

// Begin listening

app.listen(8002);
console.log("Express server listening on port %d in %s mode", app.settings.env);
