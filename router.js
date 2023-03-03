const express = require("express");
const router = express.Router();
const user = require("./database")
const bcrypt=require("bcryptjs");
const cookieParser=require("cookie-parser");
const auth=require("./authorization")


router.get("/", (req, res) => {
    res.render("index")
})

router.get("/auth", auth, (req, res) => {
    res.render("auth")
})

router.get("/loginn", (req, res) => {

    // res.send(`${req.cookies.jwt}`);
     res.render("login")
})



router.post("/register", async (req, res) => {
    try {
        const data = new user(req.body);
        if(data.password===data.confPassword){
            const emailValidation=await user.findOne({email:data.email})
            if(emailValidation){
                res.send("This Email is Already Exists, Please login")
            }
            else{
                const token=await data.generateToken();
                console.log("This Token is User : "+token);
                res.cookie("jwt", token);
                const saveData = await data.save();
                res.render("login")
            }
 
        }else{
            res.status(400).send("Password is not matching with Confirm Password")
        }
       
        // res.send(saveData);
    } catch (error) {
        res.status(400).send(error)
    }

})

router.post("/login", async (req, res) => {
    try {
        const checkEmail = req.body.email;
        const userPassword=req.body.password;
        const databaseData = await user.findOne({ email: checkEmail })
        const isMatch=bcrypt.compare(userPassword, databaseData.password)
        if (databaseData != null && isMatch) {
            const token=await databaseData.generateToken();
            res.render("contact");
        } else {
            res.status(400).send("This is not right, please fill correct details")
        }


    } catch (error) {
        res.status(400).send(error)
    }
})

router.get("/logout", auth, async(req, res) => {
    try {
        req.user.tokens=[];
        res.clearCookie("jwt");
        await req.user.save()
        res.render("login");
    } catch (error) {
        res.status(500).send(error);
    }
})


module.exports = router;