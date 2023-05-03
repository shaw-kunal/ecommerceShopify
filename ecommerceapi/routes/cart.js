const router = require("express").Router();
const Cart = require("../models/Cart");
const Product = require("../models/Product");
const { verifyAndAuth, verifyTokenAdmin, verifyToken } = require("./varifyToekn");



// CREATE 
router.post('/', verifyToken, async (req, res) => {
    const newCart = new Cart(req.body);
    try {
        const savedCart = await newCart.save();
        res.status(200).json(savedCart);
    } catch (err) {
        res.status(500).json(err);
    }
});


// UPDATE 
router.get('/:id', verifyAndAuth, async (req, res) => {
    try {
        const updateCart = await Cart.findByIdAndUpdate(
            req.params.id,
            { $set: req.body },
            { new: true });
        res.status(200).json(updateCart);
    } catch (err) {
        res.status(500).json(err);
    }
});



//Delete - verifytokenAnd auth
router.delete("/:id", verifyAndAuth, async (req, res) => {
    try {
        await Product.findByIdAndDelete(req.params.id);
        res.status(200).json("cart delete successfully");
    } catch (err) { res.status(200).json(err); }
});



// get user cart - here id is user id not cart id
router.get('/find/:userId', verifyAndAuth, async (req, res) => {
    try {
        const cart = await Cart.find({ userId: req.params.userId })
        res.status(200).json(cart);
    } catch (err) {
    }
});

// GET ALL 
router.get('/',verifyTokenAdmin,async (req,res)=>{
   try {
    const carts = Cart.find();
    res.status(200).json(carts);
   } catch (err) {
    res.status(500).json(err);
   }
})


module.exports = router;