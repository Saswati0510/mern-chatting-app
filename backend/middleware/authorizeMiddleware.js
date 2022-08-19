//verifies if user is accessing in admissible(its own resources) pages
//this middleware is called upon a logged in user
const User = require('../models/userModel')
const jwt = require('jsonwebtoken');
const expressAsyncHandler = require("express-async-handler");

const authorize = expressAsyncHandler(async (req, res, next) => {

    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(" ")[1];
            const curr_user = jwt.verify(token, process.env.JWT_SECRET)
            req.user = await User.findById(curr_user.id).select("-password") //retrieve record of the logged in user without password
            next();
        } catch (error) {
            res.status(401);
            throw new Error('Not Authorized! wrong token')

        }
    }
    if (!token) {
        res.status(401);
        throw new Error('Not Authorized!, no token')
    }

})

module.exports = { authorize }