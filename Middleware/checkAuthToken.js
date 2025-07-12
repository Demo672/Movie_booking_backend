const jwt = require('jsonwebtoken');

function checkAuthToken(req, res, next){

    const authToken = req.cookies.authToken;
    const refreshToken = req.cookies.refreshToken;


    if(!authToken || !refreshToken ){
        return res.status(401).json({message: "Authentication failed: No authToken or refresh Token provided", ok: false,})
    }


    jwt.verify(authToken, process.env.JWT_SECRET_KEY, (err, deocded) => {
        if(err){
                //authtoken is expired then check refreshtoken
                jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (refreshErr, refreshDecoded) => {
                    if(refreshErr){
                        //both token are invalid, send an error and prompt for login

                        return res.status(401).json({message: 'Authentication failed: Both token are expired', ok: False})
                    }
                    else{
                        const newAuthToken = jwt.signin({userId: refreshDecoded.userId}, process.env.JWT_SECRET_KEY,{ expiresin: '10m'})
                        
                        const newRefreshToken = jwt.signin({userId: refreshDecoded.userId}, process.env.REFRESH_TOKEN_SECRET,{ expiresin: '30mm'})


                        res.cookie('authToken', newAuthToken, { httpOnly: true});
                        res.cookie('refreshToken', newRefreshToken, {httpOnly:true})


                        req.userId = refreshDecoded.userId;
                        req.ok = true;
                        next();
                    }
                })
        }
        else{
            req.userId = deocded.userId;
            next();
        }
    })
}


module.exports = checkAuthToken;