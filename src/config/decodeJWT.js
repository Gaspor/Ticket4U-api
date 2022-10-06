const jwt = require("jsonwebtoken");

function decodeJWT(token) {
    const tokenDecoded = jwt.decode(token);

    return tokenDecoded;
}

function decodeUser(req) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    const user = decodeJWT(token);
    return user;
}

module.exports = { decodeJWT, decodeUser }