//Importação de módulos
const localStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

require('../models/user');
const user = mongoose.model('User');

module.exports = function(passport) {
    passport.use(new localStrategy({
        usernameField: 'email',
        passwordField: 'password'
    }, (email, password, done) => {
        user.findOne({email: email}).then((user) => {
            if (!user) {
                return done(null, false, {message: 'Invalid email'});
            }

            bcrypt.compare(password, user.password, (error, match) => {
                if (match) {
                    return done(null, user);
                } else {
                    return done(null, false, {message: 'Incorrect password'})
                }
            });
        }).catch((err) => {
            console.log(err);
        })
    }));

    passport.serializeUser((user, done) => {
        done(null, user.id);
    });

    passport.deserializeUser((id, done) => {
        user.findById(id).then(user => {
            done(null, user);
        }).catch(err => done(err));
    });
}