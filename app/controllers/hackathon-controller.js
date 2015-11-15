var Hackathon = require('../models/hackathon');
var User = require('../models/user');
var mongoose = require('mongoose');

function createHackathon(req, res) {
    var hackathon = new Hackathon();
    hackathon.id = mongoose.Types.ObjectId();
    hackathon.name = req.body.name;
    hackathon.description = req.body.description;
    hackathon.address = req.body.address;
    hackathon.website = req.body.website;
    hackathon.creator = mongoose.Types.ObjectId(req.body.creator);
    hackathon.save(function (err, savedHackathon) {
        User.findOne({id: mongoose.Types.ObjectId(hackathon.creator)}, function (err, creator) {
            if (err) {
                res.json({
                    type: false,
                    data: "Error occured while fetching user " + creator.id
                })
            } else {
                creator.createdHackathons.push(savedHackathon.id);
                creator.save(function () {
                    res.json({
                        type: true,
                        data: savedHackathon.data()
                    });
                });
            }
        });

    });
}

module.exports.createHackathon = createHackathon;