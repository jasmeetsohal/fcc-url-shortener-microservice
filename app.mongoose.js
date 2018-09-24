const mongoose = require('mongoose');

//connect to mongoose
mongoose.connect(process.env.MONGOLAB_URI);


const urlSchema = mongoose.Schema({
    original_url: {type:String,required:true},
    short_url : Number
});

const squencerSchema = mongoose.Schema({
    seq_name:{type:String,required:true},
    counter: Number
});

const URL = mongoose.model('URL',urlSchema);
const SQUENCER = mongoose.model('SQUENCER',squencerSchema);

module.exports = {URL,SQUENCER};