require("dotenv").config({});
const PORT = process.env.PORT || 3000
const express = require("express");
const cors = require("cors");
const path = require("path");
const cookieParser = require("cookie-parser");
const { connectDB } = require("./config/mongodb");


const userRouter = require("./routes/userRouter")
const postRouter = require("./routes/postRouter")
const messageRouter = require("./routes/chatingRouter")

const {app , server , io} = require("./socket/socket")


// const app = express();
const corsOptions = { 
    origin: "http://localhost:5173",
    credentials: true 
};

app.use(express.json());
app.use(cookieParser());
app.use(cors(corsOptions));
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.resolve(__dirname, 'public'))); 

//all apis
app.use("/api/user" , userRouter)
app.use("/api/post" , postRouter)
app.use("/api/message" , messageRouter)


app.get('/' , (req, res) => {
    return res.status(200).json({
        success: true,
        message:"i am comming fron bakcend ",
    })
})




server.listen(PORT, () => {
  connectDB()
  console.log(`Server Listen At Port ${PORT}`);
});
