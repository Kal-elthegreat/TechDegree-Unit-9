'use strict';

var mongoose = require('mongoose');

var Schema = mongoose.Schema;


    var UserSchema = new Schema ({
        firstName: String,
        lastName: String,
        emailAddress: String,
        password: String
    });

    var User = mongoose.model('User', UserSchema);
    

    var CourseSchema = new Schema ({
        user: UserSchema, // issue could lie here??
        title: String,
        description: String,
        estimatedTime: String,
        materialsNeeded: String
    });

    var Course = mongoose.model('Course', CourseSchema);

    module.exports.User = User;
    module.exports.Course = Course;