var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var morgan = require('morgan');
var mongoose = require('mongoose');
var config = require('./config');
var UserController = require('./app/controllers/user-controller');
var AuthController = require('./app/controllers/auth-controller');
var HackathonController = require('./app/controllers/hackathon-controller');

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

var apiRoutes = express.Router();
console.log('Magic happens at http://localhost:' + port);
app.post('/authenticate', AuthController.authenticate);
app.post('/signup', UserController.createUser);
app.get('/me', AuthController.ensureAuthorized, UserController.getProfile);
app.post('/user',AuthController.ensureAuthorized, UserController.updateUser);
app.put('/hackathon',AuthController.ensureAuthorized, HackathonController.createHackathon);
apiRoutes.get('/', function (req, res) {
    res.json({message: 'This is where the hackers are'});
});
app.use(apiRoutes);