const router = require("express").Router();
const Cryptojs = require("crypto-js");
const { verifyAndAuth, verifyTokenAdmin, verifyToken } = require("./varifyToekn");
const User = require("../models/User");


//stats 
router.get("/stats", verifyTokenAdmin, async (req, res) => {
    console.log("get stats method call");
    const date = new Date();
    const lastYear = new Date(date.setFullYear(date.getFullYear() - 1));


    try {
        const data = await User.aggregate([
            {
                $match: {
                    createdAt: { $gte: lastYear }
                }
            },
            {
                $project: {
                    month: { $month: "$createdAt" },
                }
            },
            {
                $group: {
                    _id: "$month",
                    total: {
                        $sum: 1
                    }
                }
            }
        ])

        res.status(200).json(data);

    } catch (err) {
        res.status(500).json(err);
    }


})

router.put("/:id", verifyAndAuth, async (req, res) => {
    console.log("clusor goes to put method");
    console.log(req.body);

    if (req.body.password) {
        req.body.password = Cryptojs.AES.encrypt(
            req.body.password,
            process.env.PASS_SECRET.toString());
    }

    try {
        const updateduser = await User.findByIdAndUpdate(
            req.params.id, {
            $set: req.body,
        }, { new: true });
        console.log("update user goes to response")
        console.log(updateduser);

        res.status(200).json(updateduser);
    } catch (err) {
        res.status(500).json(err);
    }
})

//Delete 

router.delete("/:id", verifyAndAuth, async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id);
        res.status(200).json("user has been delete")

    } catch (err) {
        res.status(500).json(err);
    }

})


//GET user
router.get("/:id", verifyTokenAdmin, async (req, res) => {

    try {
        const user = await User.findById(req.params.id);
        const { password, ...others } = user._doc;
        res.status(200).json(others);
    }
    catch (err) {
        res.status(500).json(err);

    }

})


//GET ALL USERs
router.get("/", verifyTokenAdmin, async (req, res) => {
    console.log("hello")
    const query = req.query.new;
    const no = req.query.no;

    try {
        const users = query ? await User.find().sort({ _id: -1 }).limit(no)
            : await User.find();

        const newUsers = users.map((u) => {
            const { password, ...others } = u._doc;
            return others;

        });
        console.log("the new user " + newUsers);

        res.status(200).json(newUsers);
    }
    catch (err) {
        res.status(500).json(err);

    }
});





module.exports = router;