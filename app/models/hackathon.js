var mongoose = require('mongoose');

var Schema = mongoose.Schema;
var hackathonSchema = mongoose.Schema({
    id: mongoose.Schema.ObjectId,
    creator: mongoose.Schema.ObjectId,
    name: String,
    description: String,
    address: String,
    website: String,
    city: String,
    state: String,
    participants: [{type: mongoose.Schema.ObjectId, ref: 'User'}]
});

hackathonSchema.methods.data = function () {
    return {
        id: this.id,
        name: this.name,
        description: this.description,
        address: this.address,
        website: this.website,
        city: this.city,
        state: this.state,
        creator: this.creator
    };
};

module.exports = mongoose.model('Hackathon', hackathonSchema);
