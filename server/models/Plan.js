const mongoose = require('mongoose')


const schema = new mongoose.Schema({
    planmaker:{type:mongoose.SchemaTypes.ObjectId,ref:'PlanMaker'},
    plans:[
        {
            planname:{type:String},
            start_time:{type:Date},
            end_time:{type:Date},
            start:{type:String},
            progress:{type:String},
            final:{type:String}
        }
    ]
})

module.exports = mongoose.model('Plan',schema)