const UserModel = require('../models/user');
const bcrypt = require('bcryptjs');
const passport = require('passport');

const userController = {

    //Realiza o login do usuário no sistema
    login: async (req, res, next) => {

        try {
            const { email, password } = req.body;
            var errors = [];

            //Verificação de erros
            if (!email || !password) {
                errors.push({text: 'Email and password are required'});
            }

            if (email == null || password == null) {
                errors.push({text: 'Email and password are required'});
            }

            if (typeof email == undefined || typeof password == undefined) {
                errors.push({text: 'Unable to SignIn'});
            } 

            if (errors.length > 0) {
                req.flash('error', errors);
                res.redirect('/user/login');
            } else {
                //Verifica se o usuário existe no sistema
                const user = await UserModel.findOne({ email });
                
                if (!user) {
                    errors.push({text: 'User not found'});
                } else {
                    const isPasswordMatch = await bcrypt.compare(password, user.password);

                    if (!isPasswordMatch) {
                        errors.push({text: 'Incorrect password'});
                    } else {
                        passport.authenticate('local', {
                            successRedirect: "/",
                            failureRedirect: "/user/login",
                            failureFlash: true
                        })(req, res, next);
                    }
                }

                if (errors.length > 0) {
                    req.flash('error', errors);
                    res.redirect('/user/login');
                }
            }

        } catch (error) {
            console.log('Error when logging in: ' + error);
            req.flash('error_msg', 'Internal server error');
            res.redirect('/user/login');
        }
    },

    //Realiza LogOut do usuário no sistema
    logout: async (req, res, next) => {
        try {
            req.logOut(function (err) {
                if (err) {
                    return next(err);
                }
                req.flash('success_msg', 'LogOut Successfully');
                res.redirect('/user/login');
            });
        } catch (error) {
            console.log('Error when logging out: ' + error);
            req.flash('error_msg', 'Internal server error');
            res.redirect('/');
        }
    },

    //Cadastra um usuário no sistema
    create: async (req, res, next) => {
        try {
            const { name, email, password, confirm_password } = req.body;
            var errors = [];

            //Verificação de erros
            if (!name || !email || !password || !confirm_password) {
                errors.push({text: 'All fields are required'});
            }

            if (typeof name == undefined || typeof email == undefined || typeof password == undefined || typeof confirm_password == undefined) {
                errors.push({text: 'Unable to send form data'});
            }

            if (name == null || email == null || password == null || confirm_password == null) {
                errors.push({text: 'All fields are required'});
            }

            if (password !== confirm_password) {
                errors.push({text: 'Passwords do not match'});
            }

            if (errors.length > 0) {
                req.flash('error', errors);
                res.redirect('/user/register');
            } else {
                //Verificação se já existe um email ou um username cadastrado no banco de dados
                const existingEmail = await UserModel.findOne({ email });
                const existingName = await UserModel.findOne({ name });

                if (existingEmail) {
                    errors.push({text: 'Email already registered'});
                }

                if (existingName) {
                    errors.push({text: 'Username already registered'});
                }

                if (errors.length > 0) {
                    req.flash('error', errors);
                    res.redirect('/user/register');
                }

                //Criação do usuário
                const hashedPassword = await bcrypt.hash(password, 10);

                const newUser = new UserModel({
                    name,
                    email,
                    password: hashedPassword
                });

                await newUser.save().then(() => {
                    req.flash('success_msg', 'Successfully registered!');
                    passport.authenticate('local', {
                        successRedirect: "/",
                        failureRedirect: "/user/login",
                        failureFlash: true
                    })(req, res, next);
                }).catch((error) => {
                    console.log(`Error registering user: ${error}`);
                    req.flash('error_msg', 'Error registering user');
                    res.redirect('/user/register');
                });
            }

        } catch (error) {
            console.log(`Error registering user: ${error}`);
            req.flash('error_msg', 'Internal server error');
        }
    },

    //Edita as informações do usuário no sistema
    update: async (req, res) => {
        const userId = req.params.id;
        var errors = [];
        const user = {
            email: req.body.email,
            name: req.body.username
        }

        const updatedUser = await UserModel.findByIdAndUpdate(userId, user, {new: true});

        if (!updatedUser) {
            errors.push({text: 'User not found'});
        }

        if (errors.length > 0) {
            req.flash('error', errors)
            res.redirect(`/user/profile/${userId}`);
        }

        res.redirect(`/user/profile/${userId}`);

    },

    //Deleta um usuário do sistema
    delete: async (req, res) => {

        try {
            const userId = req.params.id;
            var errors = [];
            
            const deletedUser = await UserModel.findByIdAndDelete(userId);
            
            if (!deletedUser) {
                errors.push({text: 'User not found'});
            }

            if (errors.length > 0) {
                req.flash('error', errors);
                res.redirect(`/user/profile/${userId}`);
            }
            
            res.redirect('/user/login');
        } catch (error) {
            console.log('Error deleting user: ' + error);
            req.flash('error_msg', 'Internal server error');
            res.redirect(`/user/profile/${user.id}`);
        }

    }

}

module.exports = userController;