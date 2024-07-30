const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');
const Schema = mongoose.Schema;

const instructorSchema = new Schema({
    instructorName: String,
    email: String
});

instructorSchema.plugin(passportLocalMongoose, { usernameField: 'name' });

module.exports = mongoose.model('Instructor', instructorSchema);