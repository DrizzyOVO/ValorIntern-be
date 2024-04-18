import mongoose from "mongoose"; 

const userSchema = new mongoose.Schema({ 
    username: String, 
    password: String, 
}); 

const todoSchema = new mongoose.Schema({ 
    title: String, 
    done: Boolean, 
    userId: String, 
    assignedTo: String 
}); 

export const User = mongoose.models.User || mongoose.model('User', userSchema); 
export const Todo = mongoose.models.Todo || mongoose.model('Todo', todoSchema); 

