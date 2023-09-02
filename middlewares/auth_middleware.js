const jwt = require('jsonwebtoken');

const middleware = (req, res, next) => {
    // check if request is authenticated
    // - look inside header for Authorization key
    // - key not exists -> return 401
    console.log("here");
    console.log(req.data);
    const authzHeaderVal = req.headers.authorization;
    console.log(authzHeaderVal);
    if (!authzHeaderVal) {
        res.statusCode = 401;
        return res.json({
            msg: 'must have authorization in header'
        });
    }

    // - extract JWT token from Authorization key value

    const token = authzHeaderVal.substring(7);

    // - Use JWT to verify the token
    // - return 401 if verification failed
    // jwt.verify checks for token expiry as well
    try {
        jwt.verify(token, process.env.APP_KEY);
    } catch (err) {
        console.log(err);
        res.statusCode = 401;
        return res.json({
            msg: 'failed to verify token'
        });
    }

    // decode jwt, extract user_id,set it in a globally available var in express
    const decoded = jwt.decode(token);
    if (!decoded) {
        res.statusCode = 401;
        return res.json({
            msg: "failed to decode token"
        });
    }

    //set decoded "sub" field 
    res.locals.id = decoded.id;
    res.locals.role = decoded.role;
    res.locals.authUserID = decoded.sub;

    next();
};

module.exports = middleware;