const router = require("express").Router();
const Product = require("../models/Product");
const { verifyTokenAdmin } = require("./varifyToekn");

//CREATE PRODUCT
router.post("/", verifyTokenAdmin, async (req, res) => {
    const newProduct = new Product(req.body);
    try {
        console.log("product is created");
        const savedProduct = await newProduct.save();
        res.status(200).json(savedProduct);
    } catch (err) {
        res.status(500).json(err);

    }
})


// UPDATE PRODUCT

router.put("/:id", verifyTokenAdmin, async (req, res) => {

    try {

        const updateUser = await Product.findByIdAndUpdate(
            req.params.id,
            { $set: req.body },
            { new: true });
        res.status(200).json(updateUser);
    } catch (err) {
        res.status(500).json(err);
    }
})

//DELETE 

router.delete("/:id", verifyTokenAdmin, async (req, res) => {
    try {
        await Product.findByIdAndDelete(req.params.id);
        req.status(200).json('Product has been deleted');
        req.status(200).json('Product has been deleted');
    } catch (err) {
        res.status(500).json(err);
    }

});


//GET PRODUCT - it is seen by every body
router.get("/find/:id", async (req, res) => {
    try {
        console.log("i am in find of product");
        console.log(req.params.id);
        const product = await Product.findById(req.params.id);
        res.status(200).json(product);
    } catch (err) {
        res.status(500).json(err);
    }

})


// GET ALL PRODUCT with catefory
router.get("/", async (req, res) => {
    const qnew = req.query.new;
    const qcategories = req.query.category;
    let products;
    try {
        if (qnew) {
            products = await Product.find().sort({ createdAt: -1 }).limit(1);
        }
        else if (qcategories) {
            products = await Product.find({
                categories: { $in: [qcategories] }
            });
        }
        else
            products = await Product.find();

        res.status(200).json(products);


    } catch (err) {
        res.status(500).json(err);
    }
});





module.exports = router;