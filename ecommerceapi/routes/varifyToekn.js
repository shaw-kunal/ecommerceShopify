const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
    console.log("cursor is is verifytoke")
    const authHeader = req.headers.token;
    if (authHeader) {
        const token = authHeader.split(" ")[1];
        console.log(token);
        jwt.verify(token, process.env.JWT_SEC, (err, user) => {
            if (err)
                return res.status(403).json("TOken is not valid");
            req.user = user;
            console.log("user is attached to req body")
            next();
        })

    }
    else
        return res.status(401).json("you are not authenticated");
}



const verifyAndAuth = (req, res, next) => {
    console.log("cursor on verifyAndAuth ")
    verifyToken(req, res, () => {
        console.log("cursor on after verifytoken ")
        if (req.user.id == req.params.id || req.user.isAdmin)
            next();
        else
            return res.status(403).json("you are not allow");

    })
}

const verifyTokenAdmin = (req, res, next) => {
    console.log("hello verifyTokenAdmin ")

    verifyToken(req, res, () => {
        if (req.user.isAdmin) {
            console.log("user is admin")
            next();
        }
        else
            res.status(403).json("you are not allow to do it ");

    })
}




module.exports = {
    verifyToken,
    verifyAndAuth,
    verifyTokenAdmin
};