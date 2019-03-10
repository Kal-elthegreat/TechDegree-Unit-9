'use strict';

var express = require('express');
var router = express.Router();
var Course = require('./models').Course;
var User = require('./models').User;


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
})

// GET USERS - working
router.get('/users', (req,res,next) => {
    User.find({})
    .exec(function(err,users){
        if(err) return next(err);
        res.json(users)
    });
});

// POST USERS - working
router.post('/users',(req,res,next) => {
    const user = new User(req.body);
    user.save(function(err, question){
        if(err) return next(err);
        res.status(201);
        res.json(user);
    });
});

// GET COURSES - working
router.get('/courses', (req,res,next) => {
    Course.find({},{title: true, description: true, user:true})
    .exec(function(err,courses){
        if(err) return next(err);
        res.json(courses)
    });
});

// GET COURSES:id - working
router.get('/courses/:id', (req,res,next) => {
    res.json(req.course)
});

// POST COURSES - not working (user value causing course to fail)
router.post('/courses', (req,res,next) => {
    const course = new Course(req.body);
    course.save(function(err, course){
        if(err) return next(err);
        res.json(course);
    });
});

// PUT COURSES:id
router.put('/courses/:id', (req,res,next) => {
    req.course.update(req.body, function(err,result){
        if(err) return next(err);
        res.json(result);
    });
    // updates a single course
});

// DELETE COURSES
router.delete('/courses/:id', (req,res,next) => {
    req.course.remove(function(err){
        req.course.save(function(err,course){
            if (err) return next(err);
            res.json({response: "Course" + req.params.id + "has been removed"})
        });
    });
    // deletes a single course...redirects to /courses??
});

module.exports = router;