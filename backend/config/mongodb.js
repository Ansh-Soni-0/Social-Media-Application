const mongoose = require("mongoose")

const connectDB = async () => {
    try{
        await mongoose.connect(`${process.env.MONGODB_URI}/social-media-app`)
        console.log("mongoDB connected Successfully");
    }catch(error){
        console.log(error);
    }
}

module.exports = { connectDB }