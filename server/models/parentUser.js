const mongoose = require('mongoose')
const schema = mongoose.Schema

const ParentUserSchema = new schema ({
    email: {
        type: String,
        required: true,
    },

    phoneNumber: {
        type: String,
        required: true
    },

    firstName: {
        type: String,
        required: true
    },

    lastName: {
        type: String,
        required: true
    },
    
    password: {
        type: String,
        required: true
    },
    
    children:[
        {childname: String,
        phone: String,
        location:[{latitude:String,longitude:String}] }
       
    ],
    
    location:[{latitude:String,longitude:String}]
}) 

const ParentUser = mongoose.model('parentuser', ParentUserSchema)
module.exports = ParentUser;