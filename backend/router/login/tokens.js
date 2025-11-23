const router = require('express').Router();
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const authMiddleware = require('../../middleware/authMiddleware');
const profileMiddleware = require('../../middleware/profileMiddleware');
const sendDataHandler = require('../../middleware/sendDataHandler');

router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());
router.use(cookieParser());

router.post('/tk/profile', authMiddleware, profileMiddleware, sendDataHandler);

module.exports = router;
