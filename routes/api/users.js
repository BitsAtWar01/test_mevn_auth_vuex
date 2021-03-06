const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const key = require('../../config/keys').secret;
const User = require('../../models/User');

/**
 * @route POST api/users/register
 * @desc Register the user
 * @access Public
 */

 router.post('/register', (req, res) => {
     let {
         name,
         username,
         email,
         password,
         confirm_password
     } = req.body;
     if(password !== confirm_password){
         return res.status(400).json({
             msg: "Password doesn't match."
         });
     }
     //Check for unique Username
     User.findOne({$or: [
        {username: username},
        {email: email}
     ]}).then(user => {
         if(!user){
            // The data is valid & now we can Register the User
            let newUSer = new User({
                name,
                username,
                password,
                email
            })
            //Hash the password
            bcrypt.genSalt(10, (err, salt) => {
                bcrypt.hash(newUSer.password, salt, (err, hash) => {
                    if(err) throw err;
                    else newUSer.password = hash;
                    newUSer.save().then(user => {
                        return res.status(201).json({
                            success: true,
                            msg: "User is now registered."
                        });
                    }).catch(err => {
                        console.log(err);
                    })
                })
            })
         } else if (user){
            //Check if Unique Username
            if(user.username === username){
                return res.status(400).json({
                    msg: "Username is already taken."
                });
            //Check if Unique Email
            } else if(user.email){
                return res.status(400).json({
                    msg: "Email is already registered. Did you forget your password?"
                });
            }
         }
     }).catch(err => {
         console.log(err);
     })
 });

 /**
 * @route POST api/users/login
 * @desc Login the user
 * @access Public
 */

 router.post('/login', (req, res) => {
     User.findOne({username: req.body.username}).then(user => {
         if(!user){
             return res.status(404).json({
                 msg: "Username is not found.",
                 success: false
             });
         } 
         //If there is a user, compare the password
         bcrypt.compare(req.body.password, user.password).then(isMatch => {
             if(isMatch){
                 //User's password is correct send the JSON token for that user
                 const payload = {
                     _id: user._id,
                     username: user.username,
                     name: user.name,
                     email: user.email
                 }
                jwt.sign(payload, key, { 
                    expiresIn: 604800 
                }, (err, token) => {
                    res.status(200).json({
                        success:true,
                        token: `Bearer ${token}`,
                        user: user,
                        msg: "You are now logged in."
                    })
                })
             } else {
                return res.status(404).json({
                    msg: "Incorrect Password.",
                    success: false
                });
            }
        });
    });
});

/**
 * @route POST api/users/profile
 * @desc Display the User's Data
 * @access Private
 */

 router.get('/profile', passport.authenticate('jwt', {
      session: false 
    }), (req, res) => {
    return res.json({
        user: req.user
    })
 })


module.exports = router;