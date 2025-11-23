const router = require('express').Router();

router.use('/login', require('./login/login.js')); //router
router.use('/verify', require('./auth.js')); //router
router.use('/users', require('./users.js')); //router

module.exports = router;
