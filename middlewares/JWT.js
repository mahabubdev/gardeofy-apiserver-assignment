const JWT = require('jsonwebtoken');
const { jwtSercetKey } = require('../app.config');


module.exports = (req, res, next) => {
    // console.log("headers=> ", req.headers);
    // Middleware for JWT checking
    const token = req.headers.authorization;
    // check token
    if (!token) {
        return res.status(401).json({
            message: 'Unauthorized! Invalid JWT token',
            errCode: 'error-401'
        });
    }

    // verify token
    try {
        let __jwtToken = token.split('Bearer ')[1]
        const decodeToken = JWT.verify(__jwtToken, jwtSercetKey);
        req.user = decodeToken; // passed data in req.user
        next(); // granted to be next()
    }
    catch(err) {
        return res.status(412).json({
            message: err.message,
            errors: err,
            errCode: 'error-412'
        });
    }
}