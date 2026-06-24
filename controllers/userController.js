import expressAsyncHandler from 'express-async-handler'
import User from '../models/userModel.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const registerUser = expressAsyncHandler(async (req, res) => {
    const {username, email, password} = req.body;
    if (!username || !email || !password) {
        res.status(400)
        throw new Error("All fields are required");
    }
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    if(!emailRegex.test(email)) {
        res.status(400)
        throw new Error("Email address is not valid");
    }
    if(password.length < 8) {
        res.status(400)
        throw new Error("Password must be at least 8 characters");
    }
    const normalizedEmail = email.toLowerCase().trim()
    const userAvailable = await User.findOne({email: normalizedEmail})
    if(userAvailable){
        res.status(400)
        throw new Error("User already exists");
    }
    const hashedPassword = await bcrypt.hash(password, 12);
    const user = await User.create({
        username, email: normalizedEmail, password:hashedPassword
    })
    if(user){
        res.status(201).json({_id: user.id, email : user.email})
    }else{
        res.status(400)
        throw new Error("User data is not valid");
    }
})
const loginUser = expressAsyncHandler(async (req, res) => {
    const {email, password} = req.body;
    if(!email || !password){
        res.status(400)
        throw new Error("All fields are required");
    }
    const normalizedEmail = email.toLowerCase().trim()
    const user = await User.findOne({email: normalizedEmail}).select("+password");
    if(user && (await bcrypt.compare(password, user.password))){
        const accessToken = jwt.sign({
                user:{
                    username: user.username,
                    email: user.email,
                    id: user.id
                },
            },
            process.env.ACCESS_TOKEN_SECRET, {expiresIn : "15m"})

        res.status(200).json({accessToken})
    }else {
        res.status(401)
        throw new Error("Invalid email or password");
    }
})
const currentUser = expressAsyncHandler(async (req, res) => {
    res.json(req.user)
})


export {registerUser, loginUser, currentUser}
