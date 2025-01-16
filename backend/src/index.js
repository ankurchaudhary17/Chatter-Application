import express from 'express';
import authRoutes from './routes/auth.route.js';
import messageRoutes from './routes/message.route.js';
import { connectDB } from './lib/db.js';
import cookieParser from "cookie-parser";
import {app,server} from './lib/socket.js';
import dotenv from 'dotenv';
dotenv.config();
// import 'dotenv/config';
import cors from 'cors';

import path from "path";

const PORT=process.env.PORT;

const __dirname=path.resolve();

app.use(express.json());// this is allow you to extract the json data out of body
// app.use(express.urlencoded({extended:true}));
app.use(cookieParser());
app.use(cors({
      origin:"http://localhost:5173",
      credentials:true
}))


app.use("/api/auth",authRoutes)//for authentication
app.use("/api/messages",messageRoutes)//for messages

if(process.env.NODE_ENV==='production'){
      app.use(express.static(path.join(__dirname,"../frontend/dist")));

      app.get("*",(req,res)=>{
            res.sendFile(path.join(__dirname,"../frontend","dist","index.html"));
      })
}

server.listen(PORT,()=>{
      console.log("Server is running on port:"+PORT);
      connectDB();
})
