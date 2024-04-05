import express from "express";
import dotenv from 'dotenv';
dotenv.config();
import mongoose from "mongoose";
import cors from 'cors'
import latestcampaignRouter from "./routers/latestcampaigns.router"
import categoriesRouter from "./routers/categories.router"
import newsRouter from "./routers/news.router"
import userRouter from "./routers/user.router"
import adminRouter from "./routers/admin.router"

const app = express();
app.use(cors())
app.use('/uploads/', express.static('uploads')) 
app.use(express.json());

const PORT = 8008;


mongoose.connect("mongodb://127.0.0.1:27017/charihope")
.then(()=>console.log("Connected!"));

app.listen(PORT, ()=>{
    console.log("Server is running on htttp://localhost:"+ PORT)
})

app.use(latestcampaignRouter)
app.use(categoriesRouter)
app.use(newsRouter)
app.use(userRouter)
app.use(adminRouter)
