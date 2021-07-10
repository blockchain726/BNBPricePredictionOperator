const mongoose = require('mongoose');

const userModel = mongoose.Schema({
   "address":{
      "type":"String",
      "required": true
   },
    "userId":{
       "type":"String",
       "default" : ""
    },
    "userHandle":{
        "type":"String",
        "default":""
    },
    "userRole":{
       "type":"String",
       "default":""
    },
    "userDesc":{
       "type":"String",
       "default":""
    },
    "banLevel":{
      "type": "Number",
      "default": "0"
    },
    "bannedTime":{
       "type":"Date"
    },
    "avatar": {
        "data": "Buffer",
        "contentType": "String"
    }
}, {
  timestamps: false
});

module.exports = mongoose.model('Users', userModel);
