var express = require('express');
var bodyParser = require('body-parser');
var app = express();
app.use(bodyParser.json({ limit: '100kb' }));

var couchbase = require('couchbase');
var url = "192.168.0.200:8091";
var cluster = new couchbase.Cluster(url);


var bucket = cluster.openBucket('default', function(err){
	if(err){
		console.log("Could not connect to DB");
	}
});


app.get('/',function(req, res){
	res.send("CB API Started");
});


app.get('/getdoc/:customerId', function(req,res){
	var docId = req.params.customerId;
	bucket.get(docId, function(err, response){
		if(err){
			console.log("error in get");
			res.send(err);
		}
		else{
			console.log("success");
		res.send(response.value);
		}
	});
});

app.post('/writedoc?:customerId', function(req,res){
	console.log(req.query.customerId);
	var key = req.query.customerId;
	var value = req.body;
	bucket.insert(key,value, function(err,resp){
		if(err){
			res.send(err);
		}
		else{
		res.send("write successful");
	}
	});

});


app.put('/editdoc/:customerId', function(req,res){
	var docId = req.params.customerId;
	var value = req.body;
	bucket.replace(docId,value,function(err,resp){
		if(err){
			res.send(err);
		}
		else{
		res.send("edit successful");
	}
	});

});


app.delete('/deldoc/:customerId', function(req,res){
	var docId = req.params.customerId;
	bucket.remove(docId,function(err,resp){
		if(err){
			res.send(err);
		}
		else{
		res.send("delete successful");
	}
	});

});

app.listen(3000);

