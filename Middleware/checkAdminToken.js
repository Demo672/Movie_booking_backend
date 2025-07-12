const jwt = require('jsonwebtoken');

function checkAdminToken(req, res, next){

    const adminAuthToken = req.cookies.adminAuthToken;

    if(!adminAuthToken){
        res.status(401).json({message: 'Admin authentication failed: No adminAuthtoke provided', ok : false})
    }

    jwt.verify(adminAuthToken, process.env.JWT_ADMIN_SECRET_KEY, (err, decoded) => {
        if(err){
            return res.status(401).json({message: "Admin Authentication failed: Invalid admin authtoken",  ok: false})
        }
        else{
            req.adminId  = decoded.adminId;
            next();
        }
    })
}


module.exports = checkAdminToken;