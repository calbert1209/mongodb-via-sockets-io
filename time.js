// app/models/time.js

var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var TimeSchema   = new Schema({
    name: String,
    hours:Number,
    minutes: Number,
    totalMinutes: Number,
    type: String,
    stop: String,
    boundfor: String
});

module.exports = mongoose.model('Time', TimeSchema);