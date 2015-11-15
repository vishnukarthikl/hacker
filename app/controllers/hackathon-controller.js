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
    hackathon.city = req.body.city;
    hackathon.state = req.body.state;

    User.findOne({token: req.token}, function (err, creator) {
        if (err || creator == null) {
            res.json({
                type: false,
                data: "Error occured while fetching user"
            })
        } else {
            hackathon.creator = creator.id;
            hackathon.save(function (err, savedHackathon) {
                creator.createdHackathons.push(savedHackathon.id);
                creator.save(function () {
                    res.json({
                        type: true,
                        data: savedHackathon.data()
                    });
                });
            });
        }
    });

}
function allHackathons(req, res) {
    Hackathon.find({}, function (err, hackathons) {
        if (err) {
            res.json({
                type: false,
                data: "Error occured while fetching all hackathon"
            });
        }
        res.send(hackathons);
    });
}

function addParticipant(req, res) {
    Hackathon.findOne({id: mongoose.Types.ObjectId(req.body.hackathon_id)}, function (err, hackathon) {
        if (err || hackathon == null) {
            res.json({
                type: false,
                data: "Error occured while fetching hackathon " + hackathon.id
            });
        } else {
            User.findOne({token: req.token}, function (err, participant) {
                hackathon.participants.push(participant);
                hackathon.save(function (err, savedHackathon) {
                    participant.hackathons.push(savedHackathon.id);
                    participant.save(function (err, savedParticipant) {
                        res.json({
                            type: true,
                            data: {hackathon: savedHackathon.data(), participant: savedParticipant.safeData()}
                        });
                    });
                });
            });
        }
    });
}

function getHackathon(req, res) {
    Hackathon.findOne({id: mongoose.Types.ObjectId(req.params.id)}).populate('participants').exec(function (err, hackathon) {
        res.json({
            type: true,
            data: hackathon
        });
    });
}

module.exports.createHackathon = createHackathon;
module.exports.allHackathons = allHackathons;
module.exports.addParticipant = addParticipant;
module.exports.getHackathon = getHackathon;