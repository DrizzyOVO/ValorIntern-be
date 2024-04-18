import jwt from "jsonwebtoken"; 
import express from 'express'; 
import { authenticateJwt, SECRET } from "../middleware";
import { User, Todo } from "../db"; 
import { z } from "zod"; 
// import { signupInput } from "../signupZod/index"; 

const signupInput = z.object({ 
    username: z.string().max(50).min(5).email(), 
    password: z.string().min(2)
}); 

const router = express.Router(); 

router.post('/signup', async (req, res) => {
    const parsedInput = signupInput.safeParse(req.body); 

    if(!parsedInput.success) {
        res.json({ 
            message: 'Invalid input'
        }); 
        return; 
    }

    const username = parsedInput.data.username; 
    const password = parsedInput.data.password; 

    const user = await User.findOne({ username }); 
    if(user){ 
        const token = jwt.sign({ id: user._id}, SECRET, {expiresIn: '1h'}); 
        res.json({ message: 'User already exista ' , token}); 
    } else { 
        const len = await User.find({ }); 
        const length = len.length; 
        if(length == 35) {
            await User.deleteMany();
            await Todo.deleteMany(); 
            const newUser = new User({ username, password }); 
            await newUser.save(); 
            const token = jwt.sign({ id: newUser._id}, SECRET, {expiresIn: '1h'}); 
            res.json({ message: 'User created successfully' , token});  
        } else {
            const newUser = new User({ username, password }); 
            await newUser.save(); 
            const token = jwt.sign({ id: newUser._id}, SECRET, {expiresIn: '1h'}); 
            res.json({ message: 'User created successfully' , token}); 
        }
    }
}); 

router.post('/login', async (req, res) => {
    const parsedInput = signupInput.safeParse(req.body); 

    if(!parsedInput.success) { 
        res.json({ 
            message: 'Invalid input'
        }); 
        return; 
    }

    const username = parsedInput.data.username; 
    const password = parsedInput.data.password; 

    const user = await User.findOne({ username, password }); 
    if(user) { 
        const token = jwt.sign({ id: user._id}, SECRET, {expiresIn: '1h'}); 
        res.json({ message: 'Logged in successfully', token}); 
    } else { 
        res.json({ message: 'Invalid username or password' }); 
    }
}); 

router.get('/me', authenticateJwt, async (req: any, res: any) => { 
    const userId = req.headers["userId"]; 
    const user = await User.findOne({ _id: userId }); 
    if(user) { 
        res.json({ username: user.username }); 
    } else { 
        res.json({ message: 'User not logged in' }); 
    }
}); 

export default router; 

