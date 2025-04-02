import User from "../model/UserModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const register = async (req, res) => {
    try {
        const {username, email, password} = await req.body;
        if (!username || !email || !password) {
            res.status(400);
            throw new Error("All fields are mandatory");
          }
        const availableEmail = await User.findOne({email});
        const availableUsername = await User.findOne({username});
        if (availableEmail) {
            res.status(400);
            throw new Error("Email already exists");
        }
        if (availableUsername) {
            res.status(400);
            throw new Error("Username already exists");
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({username, email, password: hashedPassword});
        if (user) {
            res.status(201).json({
                _id: user._id,
                username: user.username,
                email: user.email,
                token: null
            });
        }
        
    } catch (error) {
        res.status(400).json({message: error.message});
    }
};

const login = async (req, res) => { 
    try {
        const {email, password} =  req.body;
        if (!email || !password) {
            res.status(400);
            throw new Error("All fields are mandatory");
        }
        const user = await User.findOne({email});
        if (user && (await bcrypt.compare(password, user.password))) {
            const accessToken = jwt.sign(
              {
                user: {
                  username: user.username,
                  email: user.email,
                  _id: user._id,
                },
              },
              process.env.ACCESS_TOKEN_SECRET,
              // thoi gian het han token
              { expiresIn: "15m" }
            );
            res.status(200).json({ accessToken });
          } else {
            res.status(400);
            throw new Error("Invalid email or password");
        }
    } catch (error) {
        res.status(400).json({message: error.message});
    }
}



export {register, login};