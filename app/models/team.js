var mongoose = require('mongoose');

var teamSchema = mongoose.Schema({
    id: mongoose.Schema.ObjectId,
    members: [{type: mongoose.Schema.ObjectId, ref: 'User'}],
    desiredSkills: [String],
    projectIdea: String,
    techStack: [String],
    capacity: Number,
    projectURL: String,
    createdBy: mongoose.Schema.ObjectId
});

module.exports = mongoose.model('Team', teamSchema);
