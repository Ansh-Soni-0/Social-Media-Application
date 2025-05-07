const jwt = require("jsonwebtoken")

const isAuthenticated = async (req,res,next) =>{
    try {
        const token = req.cookies.token;
        
        if(!token){
            return res.status(401).json({
                success:false,
                message:"User not authentication"
            })
        }

        const decode = jwt.verify(token , process.env.JWT_SECRET_KEY)

        if(!decode){
            return res.status(401).json({
                success:false,
                message:"Invalid Data"
            })
        }
        
        req.id = decode.userId
        
        next();
    } catch (error) {
        console.log(error);
        res.json({success : false , message:error.message})
    }
}

module.exports = {isAuthenticated}