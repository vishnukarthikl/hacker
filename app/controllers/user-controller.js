var User = require('../models/user');
var jwt = require('jsonwebtoken');


function processUser(req, res, requestProcessor) {
    User.findOne({token: req.token}, function (err, user) {
        if (err) {
            res.json({
                type: false,
                data: "Error occurred: " + err
            });
        } else if (user == null) {
            res.json({
                type: false,
                data: "invalid token"
            });
        } else {
            requestProcessor(user);
        }
    });
}

function createUser(req, res) {
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
                userModel.name = req.body.name;
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
}

function getProfile(req, res) {
    processUser(req, res, function (user) {
        res.json({
            type: true,
            data: user.safeData()
        })
    })
}

function updateUser(req, res) {
    processUser(req, res, function (user) {
        user.skills = req.body.skills;
        user.name = req.body.name;
        user.save(function (err, savedUser) {
            res.json({
                type: true,
                data: savedUser.safeData()
            });
        });
    });
}

module.exports.createUser = createUser;
module.exports.getProfile = getProfile;
module.exports.updateUser = updateUser;