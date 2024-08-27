import mongoose from "mongoose";

const schema=new mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
        unique:true,
    },
    password:{
        type:String,
        required:true,
        },
    followers:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"User",
        },
    ],
    following:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"User",
        },
    ],
    },

    {
        timestamps:true,//it gives when user is created and updates i.e user createdAt and updatedAt i.e user kab bana vo detials aayega and lasttine user ka ye schema kab update hua tha
})

export const User=mongoose.model("User",schema);