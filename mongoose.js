'use strict';


var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/fsjstd-restapi');

var db = mongoose.connection;

db.on('error', function (err){
    console.error('Connection error:', err);
});

db.once('open', function (){
    console.log('db connection successful')
    // all db communcication goes here
    var Schema = mongoose.Schema
    var UserSchema = new Schema ({
        firstName: String,
        lastName: String,
        emailAddress: String,
        password: String
    });
    var User = mongoose.model('User', UserSchema);
    
    var CourseSchema = new Schema ({
        user: UserSchema,
        title: String,
        description: String,
        estimatedTime: String,
        materialsNeeded: String
    });
    var Course = mongoose.model('Course', CourseSchema);


    db.close();
})



