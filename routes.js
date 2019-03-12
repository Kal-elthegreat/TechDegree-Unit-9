'use strict';

const express = require('express');
const router = express.Router();
const Course = require('./models').Course;
const User = require('./models').User;
const bcryptjs = require('bcryptjs');
const auth = require('basic-auth');



router.param("id", function(req, res,next,id){
    Course.findById(id, function(err,doc){
        if(err) return next(err);
        if(!doc){
            err = new Error("Not Found");
            err.status = 404;
            return next(err)
        }
        req.course = doc;
        return next();
    })
    .populate('user')
});

var users = []; // needs correction should hold user db


const authenticateUser = (req, res, next) => {
    let message = null;

    const credentials = auth(req);

    if(credentials){
        const user = users.find(u => u.emailAddress === credentials.name);
        
        if(user) {
            const authenticated = bcryptjs
            .compareSync(credentials.pass, user.password);

            if (authenticated){
                console.log(`Authentication successful for username: ${user.emailAddress}`);
                req.currentUser = user;
            } else {
                message  = `Authentication failure for username: ${user.emailAddress}`;
            }
        }
        else {
            message = `User not found for username: ${credentials.name}`
        }
    }
    else {
    message = 'Auth header not found';
    }

    if(message) {
        console.warn(message);

        res.status(401).json({message: 'Access Denied'});
    } else {
        next();
    }
}

// GET USERS - working
router.get('/users', authenticateUser, (req,res,next) => {
    const user = req.currentUser;
  
    res.json({
      id: user._id,
      name: `${user.firstName} ${user.lastName}`,
      username: user.emailAddress,
      password: user.password
    });
});

// POST USERS - working validation complete
router.post('/users',(req,res,next) => {
    const user = new User(req.body);
    user.save(function(err, user){
        if(err) return res.status(400).json({error: err.message});
        // hash new user password
        user.password = bcryptjs.hashSync(user.password)

        users.push(user);
         // set status to 201 created
        res.sendStatus(201);
        
    });
});

// GET COURSES - working
router.get('/courses', (req,res,next) => {
    Course.find({},{title: true, description: true, user:true})
    .populate('user')
    .exec(function(err,courses){
        if(err) return next(err);
        res.json(courses)
    });
});

// GET COURSES:id - working
router.get('/courses/:id', (req,res,next) => {
    res.json(req.course)
});

// POST COURSES - working and valid
router.post('/courses', (req,res,next) => {
    const course = new Course(req.body);
    course.save(function(err, course){
        if(err) return next(err);
        else {
            res.sendStatus(201)
        }
        ;
    });
});

// PUT COURSES:id - working and valid 
router.put('/courses/:id', (req,res,next) => {
    req.course.update(req.body, function(err,result){
        if(err) return res.status(400).json({errors: err.message});
        res.sendStatus(204);
    });
});

// DELETE COURSES - working
router.delete('/courses/:id', (req,res,next) => {
    req.course.remove(function(err){
        req.course.save(function(err,course){
            if (err) return next(err);
            res.sendStatus(204)
        });
    });
});

module.exports = router;