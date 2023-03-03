const { urlencoded } = require("express");
const express=require("express");
const route = require("./router");
const app=express();

app.use(express.json());
app.use(urlencoded({extended:false}))
app.set("view engine", "ejs")

app.use(route);

const port=3000;
app.listen(port, ()=>{
    console.log("Server is running at "+port);
})