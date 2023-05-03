const router = require("express").Router();
const User = require("../models/User")
const CryptoJs = require("crypto-js")
const jwt = require('jsonwebtoken');




//REGISTER 
router.post('/register', async (req, res) => {

    const newUser = new User({
        username: req.body.username,
        email: req.body.email,
        password: CryptoJs.AES.encrypt(req.body.password, process.env.PASS_SECRET.toString()),

    });


    try {
        const savedUser = await newUser.save();
        res.status(201).json(savedUser);

    }
    catch (err) {
        res.status(500).json(err);

    }
})



//Login  
router.post("/login", async (req, res) => {
    try {
        const user = await User.findOne({ username: req.body.username })

        // check user is  present or not
        !user && res.status(401).json("there is no user exist with username " + req.body.username);

        const hashpwd = CryptoJs.AES.decrypt(user.password, process.env.PASS_SECRET);
        const userpassword = hashpwd.toString(CryptoJs.enc.Utf8);

        if (userpassword !== req.body.password)
            return res.status(401).send("wrong credential");

        const accessToken = jwt.sign({
            id: user._id,
            isAdmin: user.isAdmin
        },
            process.env.JWT_SEC,
            { expiresIn: "3d" }
        );
        console.log(accessToken);

        const { password, ...other } = user._doc;
        res.status(200).json({...other,accessToken});


    }
    catch (err) {
        res.status(500).json(err);
    }


})


module.exports = router;