const router = require("express").Router();
const Order = require("../models/Order");
const { verifyAndAuth, verifyTokenAdmin, verifyToken } = require("./varifyToekn");

router.post("/", verifyToken, async (req, res) => {
    console.log("enter in take order")
    const newOrder = new Order(req.body);
    try {
        const savedOrder = await newOrder.save();
        res.status(200).json(savedOrder);

    } catch (err) {
        res.status(500).json(err);
    }
})


//UPDATE -ONLY ADMIN CAN UPDATE THIS
router.put("/:id", verifyTokenAdmin, async (req, res) => {
    try {
        const updatedOrder = await Order.findByIdAndUpdate(
            req.params.id,
            {
                $set: req.body,
            },
            { new: true }
        );
        res.status(200).json(updatedOrder);
    } catch (err) {
        res.status(500).json(err);
    }
});


//GET mMONTHLY INCOME
router.get("/income", verifyTokenAdmin, async (req, res) => {
    const date = new Date();
    const lastmonth = new Date(date.setMonth(date.getMonth() - 1));
    const prevmonth = new Date(new Date().setMonth(lastmonth.getMonth() - 1));
    try {
        console.log("i am in get income")
        const income = await Order.aggregate([
            {
                $match: {
                    createdAt: { $gte: prevmonth }
                }
                
            },
            
            {
                $project: {
                    month: { $month: "$createdAt" },
                    sales: "$amount"
                },
            },
            {
                $group: {
                    _id: "$month",
                    total: {
                        $sum: "$sales"
                    }
                },
            }
            
        ]);
        
        console.log("i am in  end get income")
        res.status(200).json(income);


    } catch (err) {
        res.status(500).json(err);

    }

})


// GET ALL ORDER
router.get("/", verifyTokenAdmin, async (req, res) => {
    try {
        const orders = await Order.find();
        res.status(200).json(orders);
    } catch (err) {
        res.status(500).json(err);
    }
});


module.exports = router;