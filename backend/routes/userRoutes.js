const express = require('express');
const { registerUser, allUsers } = require('../controllers/userControllers');
const { authUser } = require('../controllers/userControllers');
const { authorize } = require('../middleware/authorizeMiddleware');
const router = express.Router();

router.route('/').post(registerUser).get(authorize, allUsers);
router.post('/login', authUser);

module.exports = router;