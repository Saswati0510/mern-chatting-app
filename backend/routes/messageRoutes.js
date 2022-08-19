const express = require('express');
const { sendMessage, getMessages } = require('../controllers/messageControllers');
const router = express.Router();
const { authorize } = require('../middleware/authorizeMiddleware');

router.route('/').post(authorize, sendMessage);
router.route('/:chatId').get(authorize, getMessages);

module.exports = router;