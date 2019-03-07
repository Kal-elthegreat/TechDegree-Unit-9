'use strict';

var express = require('express');
var router = express.Router();


// GET USERS
router.get('/users', (req,res,next) => {
    console.log("GET users")
});

// POST USERS
router.post('/users',(req,res,next) => {
    console.log("POST to users")
})

// GET COURSES
router.get('/courses', (req,res,next) => {
    console.log("GET courses")
})

// GET COURSES:id
router.get('/courses:id', (req,res,next) => {
    console.log("GET courses by id")
})

// POST COURSES
router.post('/courses', (req,res,next) => {
    console.log("POST to courses")
})

// PUT COURSES:id
router.put('/courses:id', (req,res,next) => {
    console.log("PUT courses by id")
})

// DELETE courses
router.delete('/courses:id', (req,res,next) => {
    console.log("DELETE courses by id")
})
module.exports = router;