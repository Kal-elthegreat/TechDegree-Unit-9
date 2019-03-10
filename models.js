'use strict';

const mongoose = require('mongoose');

var Schema = mongoose.Schema;


    var UserSchema = new Schema ({
        firstName:{
            type: String,
            required: [true, 'First name is required']
        },
        lastName:{
            type: String,
            required: [true, 'Last name is required']
        },
        emailAddress:{
            type: String,
            required: [true, 'Email address is required']
        },
        password:{
            type: String,
            required: [true, 'Password is required']
        }
    });

    var User = mongoose.model('User', UserSchema);


    var CourseSchema = new Schema ({
        user: { type: Schema.Types.ObjectId, ref: 'User' }, // issue could lie here??
        title:{
            type: String,
            required: [true, 'Please enter a title']
        },
        description:{
            type: String,
            required: [true, 'Please enter a description']
        },
        estimatedTime: String,
        materialsNeeded: String
    });

    var Course = mongoose.model('Course', CourseSchema);

    module.exports.User = User;
    module.exports.Course = Course;