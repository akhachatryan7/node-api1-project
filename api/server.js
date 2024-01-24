// BUILD YOUR SERVER HERE
const express = require('express')
const User = require('./users/model')

const server = express()
server.use(express.json())

server.get('/api/users', (req,res)=>{
    User.find()
    .then(users =>{
        res.json(users)
    })
    .catch(err =>{
        res.status(500).json({
            message:"error",
            err:err.message,
            stack:err.stack
        })
    })
})

server.get('/api/users/:id', (req,res)=>{
    User.findById(req.params.id)
    .then(user =>{
        if (!user){
            res.status(404).json({
                message: "The user with the specified ID does not exist"
            })
        }
        res.json(user)
    })
    .catch(err =>{
        res.status(500).json({
            message:"error",
            err:err.message,
            stack:err.stack
        })
    })
})

server.post('/api/users', (req,res) =>{
    const user = req.body;
    if(!user.name || !user.bio){
        res.status(400).json({
            message:'"Please provide name and bio for the user" '
        })
    }else{
        User.insert(user)
        .then(addedUser =>{
            res.status(201).json(addedUser)
        })
        .catch(err =>{
            res.status(500).json({
                message:"error",
                err:err.message,
                stack:err.stack
            })
        })
    }
    

})

server.use('*',(req,res)=>{
    res.status(404).json({
        message: "not found"
    })
})

server.delete("/api/users/:id", async (req,res)=>{
   try{
    const posUser = await User.findById(req.params.id)
    if(!posUser){
        res.status(404).json({
            message: "The user with the specified ID does not exist"
        })
    }else{
        const deletedUser = await User.remove(posUser.id)
        res.status(200).json(deletedUser)
    }
   }catch(err){
    res.status(500).json({
        message:"error",
        err:err.message,
        stack:err.stack
    })
   }
})

server.put("/api/users/:id", async (req,res)=>{
    try{
        const posUser = await User.findById(req.params.id)
        if(!posUser){
            res.status(400).json({
                message: "The user with the specified ID does not exist"
            })
        }else{
            if(!req.body.name || !req.body.bio){
                res.status(400).json({
                    message: "Please provide name and bio for the user"
                })
            }else{
                const updatedUser =await User.update(req.params.id, req.body)
                 res.status(200).json(updatedUser)
             }
            }
    }catch(err){
       res.status(500).json({
        message:"error",
        err:err.message,
        stack:err.stack
    })   
    }
})


module.exports = server; // EXPORT YOUR SERVER instead of {}
