var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var morgan = require('morgan');
var mongoose = require('mongoose');
var jwt = require('jsonwebtoken');
var config = require('./config');
var User = require('./app/models/user');

var port = process.env.PORT || 8080;
mongoose.connect(config.database);
app.set('superSecret', config.secret);
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(morgan('dev'));
app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type, Authorization');
    next();
});

app.get('/', function (req, res) {
    res.send('Hello! The API is at http://localhost:' + port + '/api');
});


app.listen(port);
console.log('Magic happens at http://localhost:' + port);

var apiRoutes = express.Router();

// route to authenticate a user (POST http://localhost:8080/api/authenticate)
app.post('/authenticate', function (req, res) {
    User.findOne({
        email: req.body.email
    }, function (err, user) {
        if (err) {
            res.json({
                type: false,
                data: "Error occured: " + err
            });
        } else {
            if (user && user.validPassword(req.body.password)) {
                res.json({
                    type: true,
                    data: user.safeData(),
                    token: user.token
                });
            } else {
                res.json({
                    type: false,
                    data: "Incorrect email/password"
                });
            }
        }
    });
});

app.post('/signup', function (req, res) {
    User.findOne({
        email: req.body.email
    }, function (err, user) {
        if (err) {
            res.json({
                type: false,
                data: "Error occured: " + err
            });
        } else {
            if (user) {
                res.json({
                    type: false,
                    data: "User already exists!"
                });
            } else {
                var userModel = new User();
                userModel.email = req.body.email;
                userModel.password = userModel.generateHash(req.body.password);
                userModel.save(function (err, user) {
                    user.token = jwt.sign(user, process.env.JWT_SECRET);
                    user.save(function (err, savedUser) {
                        res.json({
                            type: true,
                            data: savedUser.safeData(),
                            token: savedUser.token
                        });
                    });
                })
            }
        }
    });
});

function ensureAuthorized(req, res, next) {
    var bearerToken;
    var bearerHeader = req.headers["authorization"];
    if (typeof bearerHeader !== 'undefined') {
        var bearer = bearerHeader.split(" ");
        bearerToken = bearer[1];
        req.token = bearerToken;
        next();
    } else {
        res.send(403);
    }
}

app.get('/me', ensureAuthorized, function (req, res) {
    User.findOne({token: req.token}, function (err, user) {
        if (err || user == null) {
            res.json({
                type: false,
                data: "Error occurred: " + err
            });
        } else {
            res.json({
                type: true,
                data: user.safeData()
            });
        }
    });
});


apiRoutes.get('/', function (req, res) {
    res.json({message: 'This is where the hackers are'});
});

// apply the routes to our application with the prefix /api
app.use('/api', apiRoutes);