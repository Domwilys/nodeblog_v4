module.exports = {
    checkAdmin: function (req, res, next) {
        if(req.isAuthenticated() && req.user.admin == 1) {
            return next();
        }

        req.flash('error_msg', 'Exclusive for Admins');
        res.redirect('/');
    }
}