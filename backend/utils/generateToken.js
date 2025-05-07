const jwt = require("jsonwebtoken")
const key = process.env.JWT_SECRET_KEY

const createToken = (id) => {
    return jwt.sign({userId:id} , key , {expiresIn:'1d'})
}

module.exports = { createToken }