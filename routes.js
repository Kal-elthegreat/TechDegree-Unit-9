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


const authenticateUser = (req, res, next) => {
    // to do

    const credentials = auth(req);

    if(credentials){
        console.log(1) // test 1 
        User.findOne({emailAddress: credentials.name}) // <--- issue lies here, cannot access User db for some reason
        .exec(function(error, user){
            console.log(user)
            if(error) {
                console.log('error here')
                next(error);
            } 
            if(user){
                console.log(2, 'user: ' + user, 'credentials: ' + credentials.pass) // user holds- obj obj
                const auth = bcryptjs
                .compareSync(credentials.pass, user.password);
                if (auth){
                    console.log(3) // test 3
                    req.currentUser = user;
                }
            }    
        })
    
    }
    next();

};
    

// GET USERS - working
router.get('/users', authenticateUser, (req,res) => {
    const user = req.currentUser;
    //console.log('test val: ' + user)
    res.json({ // -- keep failing here, user is returning undefined 
    users: user,
    //   username: user.emailAddress,
    //   password: user.password
    });
});

// POST USERS - working validation complete
router.post('/users',(req,res,next) => {
    const user = new User(req.body);

    // hash new user password
   user.password = bcryptjs.hashSync(user.password);

    user.save(function(err, user){
        if(err) return res.status(400).json({error: err.message});

        users.push(user); // -- possible problem
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
router.post('/courses', authenticateUser, (req,res) => {

    const newCourse = new Course({
        title: req.title,
        description: req.description,
        estimatedTime: req.estimatedTime,
        materialsNeeded: req.materialsNeeded,
        user: user._id
    });

    const course = new Course(newCourse);
    course.save(function(err, course){
        if(err) return next(err);
        else {
            res.sendStatus(201)
        }
        ;
    });
});

// PUT COURSES:id - working and valid 
router.put('/courses/:id', authenticateUser, (req,res) => {
    req.course.update(req.body, function(err){
        if(err) return res.status(400).json({errors: err.message});
        res.sendStatus(204);
    });
});

// DELETE COURSES - working
router.delete('/courses/:id', authenticateUser, (req,res) => {
    req.course.remove(function(err){
        req.course.save(function(err,course){
            if (err) return next(err);
            res.sendStatus(204)
        });
    });
});

module.exports = router;

// if(credentials){
//     user = User.findOne({emailAddress : credentials.name}, function (err,user){
//         console.log('chose user: ' + user + 'cred' + credentials)
//         if(user){
//             //console.log('chose user: ' + user + 'cred' + credentials)
//             const auth = bcryptjs.compareSync(user.password, credentials.pass);
//             if(auth){ 
//                 console.log(`Authentication successful for username: ${user.emailAddress}`);
//                 req.currentUser = user;
//                 console.log('currentUser val: ' + req.currentUser)
//             } else {
//                 message = `Authentication failure for username: ${user.emailAddress}`;
//             }
//         } else {
//             message = `Authentication failure for username: ${credentials.name}`
//         }
//     });
// } else {
// message = 'Auth header not found';
// };
// // this portion is not working correctly message is returning null everytime
// if(message) {
//     console.warn(message);
//     res.status(401).json({message: 'Access Denied'});
// } else {
//     next();
// }
// };