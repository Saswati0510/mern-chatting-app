const express = require('express');
const { accessChat, fetchChats, createGroupChat, renameGroup, removeFromGroup, addToGroup } = require('../controllers/chatControllers');
const { authorize } = require('../middleware/authorizeMiddleware');
const router = express.Router();

router.route('/').post(authorize, accessChat).get(authorize, fetchChats);
router.route('/group').post(authorize, createGroupChat);
router.route('/rename').put(authorize, renameGroup);
router.route('/groupremove').put(authorize, removeFromGroup)
router.route('/groupadd').put(authorize, addToGroup)


module.exports = router;