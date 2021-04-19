const JWT = require('jsonwebtoken');
const { jwtSercetKey } = require('../app.config');


/*=== Generate JWT token ===*/
async function generateJWT({ _id, email, username }) {
    let signJWT = await JWT.sign({
        _id,
        email,
        username
    }, jwtSercetKey, { expiresIn: '12h' });

    // console.log(signJWT);

    return signJWT;
}

module.exports = {
    generateJWT,
};