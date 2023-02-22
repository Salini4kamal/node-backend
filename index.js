//import express from "express";

const express = require('express');
const app=express();
const cors=require("cors")
 const mongodb=require("mongodb")
 const mongoClient=mongodb.MongoClient;
 const bcryptjs=require("bcryptjs")
 const jwt=require("jsonwebtoken");
//import { MongoClient } from 'mongodb';

//import cors from 'cors'
//import dotenv from 'dotenv'




 const dotenv=require("dotenv").config();
//dotenv.config()
const URL=process.env.DB; 
//const URL="mongodb://127.0.0.1:27017";
//middleware
app.use(express.json());
app.use(cors({
    origin:"http://localhost:3000"
}))



let students=[]
let authenticate=function(req,res,next){
    if(req.headers.authorization){
       let verify=jwt.verify(req.headers.authorization,secret)
       if(verify){
        req.userid=verify._id;
        next();
       }else{
        res.status(401).json({message:"Unauthorized"})

       }
    }else{
        res.status(401).json({message:"Unauthorized"})
    }
    console.log(req.headers)
   
}
app.post("/register",authenticate,async function(req,res){
    try{
        const connection=await mongoClient.connect(URL)
        console.log("connection is ready ")
        const db=connection.db("b35wd_tamil");
        const salt=await bcryptjs.genSalt(10);
        const hash=await bcryptjs.hash(req.body.password,salt)
        req.body.password=hash;
        console.log(salt)
        console.log(hash)
        await db.collection("users").insertOne(req.body)
        await connection.close();
res.json({
    message:"successfully registered"
})
    }catch(error){
res.json({
    message:"Error"
})
    }
})

app.post("/login",authenticate,async function(req,res){
    try{
        const connection=await mongoClient.connect(URL)
        const db=connection.db("b35wd_tamil");
       const user =await db.collection("users").findOne({name:requestAnimationFrame.body.name});
       if(user){
const match =await bcryptjs.compare(req.body.password,user.password);
if(match){
    //token
    const token=jwt.sign({_id:user._id},"secret",{expriesIn:"1m"})
    console.log(token)
    res.json({
        message:"successfully logged in",
        token
    })
}else{
    res.status(401).json({
        message:"password is incorrect"
    })
}
       }else{
        res.status(401).json({
            message:"User not found",
        })
       }
    }catch(error){
console.log(error)
    }
})
app.get("/students",authenticate
,async function(req,res){
    // res.json(students)
    // console.log(students)
    try{
        const connection=await mongoClient.connect(URL)
        const db=connection.db("b35wd_tamil");
      let students=  await db.collection("students").find().toArray()
await connection.close();
res.json(students)

    }catch(error){
console.log(error)
    }

})
// app.get("/teachers",function(req,res){
//     res.json([
//         {
//             name:"john",
//             age:"40",
//         }
//     ])
// })

app.post("/student",authenticate ,async function(req,res){

try{
//open the connection 
   const connection=await mongoClient.connect(URL)
//select the db
const db=connection.db("b35wd_tamil");
req.body.userid=mongodb.ObjectId(req.userid);
//select the connection and do the operation
await db.collection("students").insertOne(req.body);
await connection.close();
res.json({
    message:"student added successfully"
})
}catch(error){
    console.log(error)
}



    // req.body.id=students.length + 1;
    // console.log(req.body);
    // students.push(req.body)
   
    // res.json({
    //     message:"student added succesfully"
    // })
})

app.get("/student/:id",async function(req,res){                                        //it is a server params id
    //console.log(req.params.id);
//     const id =req.params.id;
//     console.log(id);
//     const student=students.find((student)=>student.id == id);
//    // console.log(student)
//     res.json(student);


try{
    const connection=await mongoClient.connect(URL)
    const db=connection.db("b35wd_tamil");
 let student=   await db.collection("students").findOne({_id:mongodb.ObjectId(req.params.id)})
 await connection.close();
 res.json(student)
}catch(error){
console.log(error)
}
})

app.put("/student/:id",authenticate,async function(req,res){
    //find the student with id
// const id=req.params.id;
// const studentindex=students.findIndex((student)=>student.id==id);
// students[studentindex].email=req.body.email;
// students[studentindex].password=req.body.password;
// res.json({message:"updated successfully"})
try{
    const connection=await mongoClient.connect(URL)
    const db=connection.db("b35wd_tamil");
    let student = await db.collection("students").updateOne({_id:mongodb.ObjectId(req.params.id)},{$set:req.body})
    await connection.close()
    res.json({
        message:"student updated successfully",
    });


}catch(error){
    console.log(error)
}



})


app.delete("/student/:id",authenticate, async function(req,res){
    // const id =req.params.id;
    // const studentindex=students.findIndex((student)=>student.id==id);
    // students.splice(studentindex,1);
    // res.json({message:"deleted successfully"})
    try{
        const connection=await mongoClient.connect(URL)
        const db=connection.db("b35wd_tamil");
        let student=   await db.collection("students").deteteOne({_id:mongodb.ObjectId(req.params.id)})
    await connection.close()
    res.json({
        message:"student deleted successfully",
    })
    
    }catch(error){
        console.log(error)
        }
})
app.listen(3001)