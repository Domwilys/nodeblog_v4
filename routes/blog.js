//Importação de módulos
const router = require('express').Router();
const { checkAuthenticated } = require('../helpers/checkAuthenticated');
const { checkAdmin } = require('../helpers/checkAdmin');
const blogController = require('../controllers/blogController');

router.route('/').get((req, res) => blogController.getPostagens(req, res));
router.route('/').post((req, res) => {});

module.exports = router;