const expressAsyncHandler = require("express-async-handler");
const Chat = require("../models/chatModel");
const Message = require("../models/messageModel");
const User = require("../models/userModel");


const sendMessage = expressAsyncHandler(async (req, res) => {
    const { content, chatId } = req.body;
    if (!content || !chatId) {
        console.log("Invalid data passed to request");
        res.sendStatus(400)

    }

    var newMessage = {
        sender: req.user._id,
        content: content,
        chat: chatId
    };

    try {
        var message = await Message.create(newMessage);
        message = await message.populate('sender', 'name email pic')
        message = await message.populate('chat')
        message = await User.populate(message, {
            path: 'chat.users',
            select: 'name email pic'
        })

        await Chat.findByIdAndUpdate(chatId, { latestMessage: message })

        res.json(message);
    } catch (error) {
        res.status(400);
        throw new Error(error.message);

    }
})


const getMessages = expressAsyncHandler(async (req, res) => {
    try {
        const messages = await Message.find({ chat: req.params.chatId }).populate('sender', 'name email pic').populate('chat')
        res.json(messages);
    } catch (error) {
        res.status(400);
        throw new Error(error.message);
    }
})

module.exports = { sendMessage, getMessages }