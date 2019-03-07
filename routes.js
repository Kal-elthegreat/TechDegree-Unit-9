'use strict';

var express = require('express');
var router = express.Router();
var Course = require('./models').Course;
var User = require('./models').User;


// GET USERS
router.get('/users', (req,res,next) => {
    res.json({response: "GET to users"})
});

// POST USERS
router.post('/users',(req,res,next) => {
    res.json({
        response: "POST to users",
        body: req.body
    });
});

// GET COURSES
router.get('/courses', (req,res,next) => {
    res.json({response: "GET courses"})
});

// GET COURSES:id
router.get('/courses/:id', (req,res,next) => {
    res.json({response: "GET courses by id"})
});

// POST COURSES
router.post('/courses', (req,res,next) => {
    res.json({
        response: "POST to courses",
        body: req.body,
        userId: req.body.user
    });
});

// PUT COURSES:id
router.put('/courses/:id', (req,res,next) => {
    res.json({
        response: "PUT to courses id " + req.params.id,
        body: req.body,
        userId: req.body.user
    });
});

// DELETE COURSES
router.delete('/courses/:id', (req,res,next) => {
    res.json({response: "DELETE from courses id" + req.params.id})
});

module.exports = router;