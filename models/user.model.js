import mongoose from "mongoose";

const Schema = mongoose.Schema;

const userSchema = new Schema({
    firstName:{
        type:String,
        required:true
    },
    lastName:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
    },
    password:{
        type:String,
        required:true,
    },
    contact:{
        type:Number,
        default:null,
    },
    textarea:{
        type:String,
        default:null

    },
    status:{
        type:Number,
        default:1,
    },

    createdAt:{
        type:Date,
        default:Date.now(),
    }
})

export default mongoose.model("user", userSchema)