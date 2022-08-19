// contains all contollers of 'user' api endpoint

const expressAsyncHandler = require("express-async-handler");
const generateToken = require("../config/generateToken");
const User = require('../models/userModel')
const bcrypt = require('bcryptjs');


const registerUser = expressAsyncHandler(async (req, res) => {
    const { name, email, password, pic } = req.body;

    if (!name || !email || !password) {
        res.status(400);
        throw new Error('Please enter all the fields');
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
        res.status(400);
        throw new Error('User already exists!')
    }
    const salt = bcrypt.genSaltSync(10);

    const saltedPwd = await bcrypt.hash(password, salt);

    const user = await User.create({
        name,
        email,
        password: saltedPwd,
        pic
    })

    if (user) {
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            pic: user.pic,
            token: generateToken(user._id)
        })
    } else {
        res.status(400);
        throw new Error('Failed to create user.')
    }
});

const authUser = expressAsyncHandler(async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
        res.status(400);
        throw new Error("Please try to login with correct credentials")
    }

    const passwordCompare = await bcrypt.compare(password, user.password);
    if (!passwordCompare) {
        res.status(400);
        throw new Error("Please try to login with correct credentials")
    }
    res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        pic: user.pic,
        token: generateToken(user._id)
    })
})

//api/user?search=saswati
const allUsers = expressAsyncHandler(async (req, res) => {
    const keyword = req.query.search ? {
        $or: [
            { name: { $regex: req.query.search, $options: "i" } },
            { email: { $regex: req.query.search, $options: "i" } }

        ]
    } : {};

    const users = await User.find(keyword).find({ _id: { $ne: req.user._id } })
    res.send(users)

})
module.exports = { registerUser, authUser, allUsers };


