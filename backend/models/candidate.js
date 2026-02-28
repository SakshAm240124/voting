const mongoose = require('mongoose');
const { type } = require('node:os');
const { ref } = require('node:process');
const candidateSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    party:{
        type: String,
        required: true
    },
    age:{
        type: Number,
        required: true
    },
    votes:[
        {
            user:{
                type:mongoose.Schema.Types.ObjectId,
                ref:'User',
                required: true
            },
            votedAt:{
                type: Date,
                default: Date.now()
            },    
        }
    ],
    votecount:{
        type: Number,
        default: 0
    }   

    

});
const candidate = mongoose.model('candidate', candidateSchema);
module.exports = candidate;