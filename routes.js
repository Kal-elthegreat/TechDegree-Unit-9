'use strict';

const express = require('express');
const router = express.Router();
const Course = require('./models').Course;
const User = require('./models').User;
const bcryptjs = require('bcryptjs');
const auth = require('basic-auth');

//const users = [{emailAddress: 'paul@wall.com', password: '$2a$10$aZJon4If7ZskfteR.O3wWe0U.xW4I.k5ePsYSnzaB2b.rvSRYvfrC'}] // ignore this

const authUser = (req,res,next) => {
    let message = null;
    const credentials = auth(req);
    if(credentials.name && credentials.pass){
        console.log('good: ' + credentials);
        //const user = users.find(u => u.emailAddress === credentials.name);
       const user = User.findOne({emailAddress: credentials.name})
       .exec(function(err,users){
        // ?? what goes here ??
       })
        if(user){
            console.log('user avail: ' + user.password, credentials)
            const auth = bcryptjs
            .compareSync(credentials.pass, user.password);
            console.log(auth)
            if(auth){
                console.log('User authenticated')
                req.currentUser = user;
            } else{
                message = 'Authentication fail';
                //onsole('User not authenticated')
            }
        } else {
            message = 'User not found';
            //console.log('no user here' + user)
        }
    } else {
        message = 'Username/Password';
        console.log( 'Username or Password needed', credentials.name + credentials.pass)
    }

    if(message){
        console.warn(message);
    }
};

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

    

// GET USERS - working
router.get('/users', (req,res, next) => {
    /// this block will be replaced once authUser works
    User.find({})
    .exec(function(err,users){
        if(err) return next(err);
        res.json(users)})
    /////

    //const user = req.currentUser;
    //res.json({ // -- keep failing here, user is returning undefined 
    //     users: user,
    //     username: user.emailAddress,
    //    password: user.password
    //});
});

// POST USERS - working validation complete
router.post('/users',(req,res,next) => {
    const user = new User(req.body);
    
    if(user.password){
    // hash new user password
    user.password = bcryptjs.hashSync(user.password);
    };
    
    user.save(function(err){
        if(err) return res.status(400).json({error: err.message});
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
router.post('/courses',  (req,res,next) => {

    const newCourse = new Course({
        title: req.body.title,
        description: req.body.description,
        estimatedTime: req.body.estimatedTime,
        materialsNeeded: req.body.materialsNeeded
        //user: user._id
    });

    const course = new Course(newCourse);
    course.save(function(err){
        if(err) return next(err);
        else {
            res.sendStatus(201)
        }
        ;
    });
});

// PUT COURSES:id - working and valid 
router.put('/courses/:id', (req,res) => {
    req.course.update(req.body, function(err){
        if(err) return res.status(400).json({errors: err.message});
        res.sendStatus(204);
    });
});

// DELETE COURSES - working
router.delete('/courses/:id',(req,res) => {
    req.course.remove(function(err){
        req.course.save(function(err,course){
            if (err) return next(err);
            res.sendStatus(204)
        });
    });
});

module.exports = router;
