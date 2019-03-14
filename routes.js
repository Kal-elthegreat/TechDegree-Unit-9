'use strict';

const express = require('express');
const router = express.Router();
const Course = require('./models').Course;
const User = require('./models').User;
const bcryptjs = require('bcryptjs');
const auth = require('basic-auth');

// Authentication Middleware
const authUser = (req,res,next) => {
    const credentials = auth(req); // get user inputs
    if(credentials.name && credentials.pass){
        console.log(credentials)
        User.findOne({emailAddress: credentials.name }, function(err, user){ // check db for email
        if(user){
            const auth = bcryptjs.compareSync(credentials.pass,user.password); // compare hashed password & given password
            if(auth){
                console.log('USER AUTHORIZED') // if match
                req.currentUser = user; // pass to next middleware
                
            } else {
                // passwords not a match
                err = new Error('Password');
                err.status = 401;
                res.status(err.status)
                .json({message:'Access Denied: ' + err.message});
                //next(err);
            }
        } else { 
            // IF NO USER
            err = new Error('User not found');
                err.status = 401;
                res.status(err.status)
                .json({message:'Access Denied: ' + err.message});
                //next(err);
            }   
        })
    } else { // no creds
         const err = new Error('Missing user/password');
         err.status = 401;
         res.status(err.status)
         .json({message:'Access Denied: ' + err.message});
         //next(err);
     } 
        next();     
    }; // end middleware



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
router.get('/users',authUser, (req,res, next) => {
    /// this block replaced authUser block
    User.find({})
    .exec(function(err){
        if(err) return next(err);
        res.json(req.currentUser)
    });
});

// router.get('/users', authUser, function (req,res,next) {
//     const userSelected = req.currentUser; // holds no data here; see lines 18 & 24
//     console.log('userSelected: '+ userSelected)
//     res.json({ // -- keep failing here because userSelected is returning undefined 
//         user: userSelected._id,
//         username: userSelected.emailAddress,
//        password: userSelected.password
//     });
// });

// POST USERS - working validation complete
router.post('/users',(req,res,next) => {
    const user = new User(req.body);
    
    if(user.password){
    // hash new user password
    user.password = bcryptjs.hashSync(user.password);
    };
    
    user.save(function(err){
        if(err) return res.status(400).json({error: err.message});
        res.location('/');
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
router.post('/courses', authUser, (req,res,next) => {

    const newCourse = new Course({
        //user: req.currentUser._id, // <---- should hold user id
        user: req.body.user,
        title: req.body.title,
        description: req.body.description,
        estimatedTime: req.body.estimatedTime,
        materialsNeeded: req.body.materialsNeeded,
    });

    const course = new Course(newCourse);
    course.save(function(err){
        if(err) return next(err);
        else {
            res.location('/' + course.id)
            res.sendStatus(201)
        };  
    });
});

// PUT COURSES:id - working and valid 
router.put('/courses/:id', authUser, (req,res) => {
    req.course.update(req.body, function(err){
        if(err) return res.status(400).json({errors: err.message});
        res.sendStatus(204);
    });
});

// DELETE COURSES - working
router.delete('/courses/:id', authUser, (req,res) => {
    req.course.remove(function(err){
        req.course.save(function(err,course){
            if (err) return next(err);
            res.sendStatus(204)
        });
    });
});

module.exports = router;



//VERSION 1
const authUser1 = (req,res,next) => {
    let message = null;
    const credentials = auth(req);
    if(credentials.name && credentials.pass){
        console.log('good: ' + credentials);
  
       const userSelected = User.findOne({emailAddress: credentials.name})
       .exec(function(err,user){
        // ?? what goes here ??

        if(err) return(err)
       })
        if(userSelected){
            console.log('user avail: ' + userSelected.password, credentials)
            const auth = bcryptjs
            .compareSync(credentials.pass, userSelected.password);
            console.log(auth)
            if(auth){
                console.log('User authenticated')
                req.currentUser = userSelected;
            } else{
                message = 'Authentication fail';
  
            }
        } else {
            message = 'User not found';
 
        }
    } else {
        message = 'Username/Password';
        console.log( 'Username or Password needed', credentials.name + credentials.pass)
    }

    if(message){
        console.warn(message);
        res.status(401).json({ message: 'Access Denied' });
    } else {
        next();
    } 
};

///VERSION 2
//  Authentication Middleware
// const authUser = (req,res,next) => {
//     let message = null;
//     const credentials = auth(req);
//     if(credentials.name && credentials.pass){
//         console.log('good: ' + credentials);
//         //const user = users.find(u => u.emailAddress === credentials.name);
//        User.findOne({emailAddress: credentials.name})
//        .exec(function(err,user){ // user exists here <----

//         if(user){
//             console.log('user avail: ' + user.password, credentials)
//             const auth = bcryptjs
//             .compareSync(credentials.pass, user.password);
//             console.log(auth)
                
//             if(auth){
//                 req.currentUser = user; // user still exists here
//                 console.log('USER AUTHENTICATED: ' + req.currentUser)
//                 } else{
//                 console.log('Authentication fail')
//                 message = 'Authentication fail';
//                 }
//             } else {
//                 console.log('User not found')
//                 message = 'User not found';
//             }
//         if(err) return(err)
//      }) // end findOne()
//     } else {
//         console.log('Username/Password')
//         message = 'Username/Password'; 
//     }
//     if(message){
//         console.warn(message)
//         res.status(401).json({ message: 'Access Denied' });
    
//     }
//     next();
// };


// VERSION 3
// const authUser = (req,res,next) => {
//     const credentials = auth(req); // get user inputs
//     User.findOne({emailAddress: credentials.name }, function(err, user){ // check db for email
//         if(user){
//             const auth = bcryptjs.compareSync(credentials.pass,user.password); // compare hashed password & given password
//             if(auth){
//                 console.log('User Authorized') // if match
//                 req.currentUser = user; // pass to next middleware
//             } else {
//                 err = new Error;
//                 res.status = 401;
//                 res.json({message:'Acces Denied'})
//                 next(err);
//                 // passwords not a match

//             }
//         } else { 
//             // IF NO USER
//             err = new Error;
//                 res.status = 401;
//                 res.json({message:'Acces Denied'})
//                 next(err);
//             }   
//         })       
//     }; // end middleware