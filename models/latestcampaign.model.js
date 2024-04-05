import mongoose from "mongoose";

const Schema = mongoose.Schema;
const Latestcampaign = new Schema({
    title:{
        type:String,
        required:true,
    },

    description:{
        type:String,
        required:true,
    }, 
    days:{
        type: String,
        required:true
    },
    raised:{
        type: Number,
        require: true,
    },
    goal:{
        type:Number,
        required:true
    },
    donor:{
        type: Number,
        required:true,
    },
    image:{
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

export default mongoose.model('latestcampaign',Latestcampaign)


