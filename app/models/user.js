var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');
var Schema = mongoose.Schema;

// set up a mongoose model and pass it using module.exports
var userSchema = mongoose.Schema({
    email: String,
    password: String,
    token: String,
    skills: {type: Array, "default": []},
    name: String
});

userSchema.methods.generateHash = function (password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

userSchema.methods.validPassword = function (password) {
    return bcrypt.compareSync(password, this.password);
};

userSchema.methods.safeData = function () {
    return {name: this.name, email: this.email, token: this.token, skills: this.skills}
};

module.exports = mongoose.model('User', userSchema);