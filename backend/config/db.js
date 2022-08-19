const mongoose = require('mongoose');
const mongoUri = 'mongodb://localhost:27017/Mern-Chat-App?readPreference=primary&appname=MongoDB%20Compass&ssl=false'

const connectToMongo = () => {
    mongoose.connect(mongoUri, () => {
        console.log('connected to mongoDb successfully');
    })
}

module.exports = connectToMongo;