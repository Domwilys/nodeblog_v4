//Importação de módulos
const router = require('express').Router();
const userController = require('../controllers/userController');
const { checkAuthenticated } = require('../helpers/checkAuthenticated');

//Registro do usuário
router.route('/user/register').get((req, res) => res.render('users/register'));
router.route('/user/register').post((req, res, next) => userController.create(req, res, next));

//Login do usuário
router.route('/user/login').get((req, res) => res.render('users/login'));
router.route('/user/login').post((req, res, next) => userController.login(req, res, next));

//Logout
router.route('/user/logout').get((req, res, next) => userController.logout(req, res, next));

//Perfil do usuário
router.route('/user/profile/:id').get(checkAuthenticated, (req, res) => res.render('users/profile'));
router.route('/user/profile/:id/update').post(checkAuthenticated, (req, res) => userController.update(req, res));
router.route('/user/profile/delete/:id').post(checkAuthenticated, (req, res) => userController.delete(req, res));

module.exports = router;