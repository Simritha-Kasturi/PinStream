import {User} from "../models/userModel.js"
import bcrypt from "bcrypt"
import generateToken from './../utils/generateTokens.js';

//register route
export const registerUSer=async(req,res)=>{
    try{
        const {name,email,password}=req.body;
         let user=await User.findOne({email})
         //if the mail is already used
         if(user) return res.status(400).json({
            message:"Already have an account with this email"
         });

        //if no such mail found then we store user details and hash his password
         const hashPassword=await bcrypt.hash(password,10);

         user=await User.create({
            name,email,password:hashPassword,
         });

         generateToken(user._id,res)

         res.status(201).json({
            user,
            message:"user Registered"
         });
    }catch(error){
        console.log(error);
        res.status(500).json({
            message:error.message
        })
    }
} 

//login route
export const loginUser=async(req,res)=>{
    try{
        const {email,password}=req.body;
        const user=await User.findOne({email})
        if(!user) 
            return res.status(400).json({
                message:"No user with this mail"
            })

        const comparePassword=await bcrypt.compare(password,user.password);

        if(!comparePassword)
            return res.status(400).json({
                 message:"Wrong password"
             })

        generateToken(user._id,res)

       res.json({
        user,message:"Logged in"
       })       
      }catch(error){
            console.log(error);
            res.status(500).json({
            message:error.message
    })
}
}

//fetching my profile
export const myProfile=async(req,res)=>{
    try{
        const user=await User.findById(req.user._id);
        res.json(user)
    }catch(error){
        console.log(error);
        res.status(500).json({
            message:error.message
        })
    }
}

//fetching others profile
export const userProfile=async(req,res)=>{
    try{
        const user=await User.findById(req.params.id).select("-password")//to make sure the password of others is not visible on fetching his profile
        res.json(user);
    }catch(error){
        console.log(error);
        res.status(500).json({
            message:error.message
        })
    }
}

//user follow unfollow
export const followAndUnfollowUser=async(req,res)=>{
    try{
        //user
        const user=await User.findById(req.params.id);
        //we i.e who loggedin
        const loggedInUser=await User.findById(req.user._id);

        if(!user)
            return res.status(400).json({
                message:"No user with this id"
            })
        if(user._id.toString()===loggedInUser._id.toString())
            return res.status(400).json({
                message:"you cant follow yourself"
            })
            //if we are already following that user then we check in his followers if our id is there or jnot if there then that means we are following him already and now we can unfollow
        if(user.followers.includes(loggedInUser._id)){
            //index of the user in my following list
            const indexFollowing=loggedInUser.following.indexOf(user._id)
            //index of my accnt in his followers list
            const indexFollowers=user.followers.indexOf(loggedInUser._id)

            loggedInUser.following.splice(indexFollowing,1);
            user.followers.splice(indexFollowers,1);

            await loggedInUser.save();
            await user.save();

            res.json({
                message:"User Unfollowed",
            })
        }else{
            loggedInUser.following.push(user._id);
            user.followers.push(loggedInUser._id);

            await loggedInUser.save()
            await user.save()

            res.json({
                message:"User followed"
            })
        }
    }catch(error){
        console.log(error);
        res.status(500).json({
            message:error.message
        })
    }
}

export const logOutUser=async(req,res)=>{
    try{
        res.cookie("token","",{maxAge:0});

        res.json({
            message:"Logged Out successfully"
        })
    }catch(error){
        console.log(error);
        res.status(500).json({
            message:error.message
        })
    }
}

