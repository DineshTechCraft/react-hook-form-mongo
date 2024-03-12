const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");    
const multer = require('multer');
const path = require('path');



const app = express();
const port=5000;

app.use(cors());
mongoose.connect("mongodb://127.0.0.1:27017/register");

const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));
db.once("open", () => {
  console.log("Connected to MongoDB");
});

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
});
const User=mongoose.model("User",userSchema)
app.use(bodyParser.json());

const storage=multer.diskStorage({
  destination:(req,file,cb)=>{
    const uploadPath=path.join(__dirname,'profile-pictures');
    cb(null,uploadPath);
  },
  filename:(req,file,cb)=>{
    cb(null,Date.now()+path.extname(file.originalname));

  },
});
const upload=multer({storage:storage});

app.post('/upload_profile_picture',upload.single('file'),(req,res)=>{
  console.log('File  uploaded successfully:',req.file);
  res.status(200).send('Profile picture uploaded successfully');
});




app.post("/register", async (req, res) => {
  try {
    const newUser = new User(req.body);
    await newUser.save();
    console.log("User Saved to MongoDB:",newUser)
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error("Error saving user to MongoDB:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

app.get("/getusers", async (req, res) => {
    try{
        const users=await User.find();
        res.json(users);

    }catch(error){
        console.error("Error fetching users from MongoDB:", error);
        res.status(500).json({ message: "Internal Server Error" });
        
    }
});


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});