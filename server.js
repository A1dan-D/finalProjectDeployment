const express = require("express");
const path = require("path");
const app = express();
const port = 3000;
const cors = require("cors");
require("dotenv").config()
app.use(cors())
app.use(express.json());
const db = require("knex")({
  client: "pg",
  connection: {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
  },
});

app.get("/", async (req, res) =>{
    res.send("HI")
    // const data = await db("reminders").select()
    // console.log(data)
    // res.json(data)
})

app.post("/register", async (req, res) => {
  try {
    console.log(req.body)
    const userInput = await db("users")
      .insert({
        email: req.body.email,
        password: req.body.password,
        full_name: req.body.fullName
      })
      .returning("*");
    res.json("Registered successfully");
  } catch (e) {
    res.json("Email Already Exists")
  }
});

app.post("/AddReminder", async (req, res) => {
  try {
    console.log(req.body)
    const userInput = await db("reminders")
      .insert({
        rmndr: req.body.reminder,
        date: req.body.date,
        urgency: req.body.urgency,
        user_id: req.body.userId
      })
      .returning("*");
    res.json("Registered successfully");
    res.status(200);
  } catch (e) {
    console.log(e)
    res.json("Reminder Already Exists")
   res.status(400);
  }
});

app.post("/login", async (req, res) => {
  const userInput = await db("users").select().where({
    email: req.body.email,
    password: req.body.password,
  });
  console.log(userInput);
  if (userInput.length > 0) {
    res.status(200).json({id:userInput[0].user_id,email:userInput[0].email});
  } else {
    res.status(400).json("Wrong login credentials ");
  }
});

app.get("/getRemindersById",async(req,res)=>{
const id = JSON.parse(req.headers.id).id
let result=await db("reminders").select().where({user_id:id})

res.json(result)

})

app.delete("/removeRemindersById/:id", async(req,res)=>{
  console.log(req.params.id)
try{ 
  let info= await db('reminders').where('reminder_id',req.params.id).del()
console.log(info)
res.json("deleted successfully id "+req.params.id)
}catch(err){
  res.json("An error has occured")
}
  
})
app.use(express.json())


app.listen(process.env.PORT, () => console.log("Server is running on port " + process.env.PORT));

app.use(express.static(path.join(__dirname, "client/build")));

app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "./client/build", "index.html"));
});