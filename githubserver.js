const express = require('express');
const bodyParser= require('body-parser'),
  cors = require('cors'),
  http = require('http'),
  fs = require('fs'),
  compression = require('compression');
var github = require('octonode');
var app = express();
const port = 3000;

app.use(compression({filter: shouldCompress}))
function shouldCompress (req, res) {
  if (req.headers['x-no-compression']) {
    // don't compress responses with this request header
    return false
  }
  // fallback to standard filter function
  return compression.filter(req, res)
}
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));
app.use(cors());

http.createServer(app).listen(port, function (err) {
  console.log('listening on http://localhost:' + port);
});

var client = github.client({
  username: 'ashish9308',
  password: 'Samsungashi12!'
  });


var ghme = client.me();

app.get('/test', function (req, res) {
     res.send("Hello");      
});

app.post('/createrepo', function (req, res) {
 var repodata = req.body;
 console.log(repodata);
 ghme.repo(repodata, function (error, result, request) {
    if (result) {
        var reponame = req.body.reponame;
        var userList = req.body.userlist;
        var gherepo = client.repo(reponame);
        for (users of userList) {
         gherepo.addCollaborator(users,function (error, result, request) {
            console.log(request);
            if (result) {
                console.log(result);
                return;
            }
         })
}

     res.send(result);      
} else {
	res.send(error);
}
    
});
})

app.post('/revokeaccess', function (req, res) {
var repodata = req.body;
ghme.repo(repodata, function (error, result, request) {
        var reponame = req.body.reponame;
        console.log(reponame);
        var userList = req.body.userlist;
        console.log(userList)
        var gherepo = client.repo(reponame);
    
        for (users of userList) {
        console.log(users);
        gherepo.removeCollaborator(users,function (error, result, request) {
            console.log(request);
            if (result) {
                console.log("inside result");
                console.log(result);
                return;
            }
         })
}      
     res.send("Access Revoked")
    
});
})
