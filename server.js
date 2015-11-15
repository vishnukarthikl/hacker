var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var morgan = require('morgan');
var mongoose = require('mongoose');
var config = require('./config');
var UserController = require('./app/controllers/user-controller');
var AuthController = require('./app/controllers/auth-controller');
var HackathonController = require('./app/controllers/hackathon-controller');
var TeamController = require('./app/controllers/team-controller');

var port = process.env.PORT || 8080;
var mongodb = process.env.MONGOLAB_URI || config.database;

mongoose.connect(mongodb);
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

app.listen(port);

var apiRoutes = express.Router();
console.log('Magic happens at http://localhost:' + port);
app.post('/authenticate', AuthController.authenticate);
app.post('/signup', UserController.createUser);
app.get('/me', AuthController.ensureAuthorized, UserController.getProfile);
app.post('/user', AuthController.ensureAuthorized, UserController.updateUser);
app.put('/hackathon', AuthController.ensureAuthorized, HackathonController.createHackathon);
app.get('/hackathon', AuthController.ensureAuthorized, HackathonController.allHackathons);
app.get('/hackathon/:id', AuthController.ensureAuthorized, HackathonController.getHackathon);
app.post('/add-participant', AuthController.ensureAuthorized, HackathonController.addParticipant);
app.put('/team',AuthController.ensureAuthorized, TeamController.createTeam);
app.post('/add-team-member',AuthController.ensureAuthorized, TeamController.joinTeam);
apiRoutes.get('/', function (req, res) {
    res.json({message: 'This is where the hackers are'});
});
app.use(apiRoutes);
