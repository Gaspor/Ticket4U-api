const jwt = require("jsonwebtoken");

function jwtTokens({ id, username, email, cargo }) {
    const user = { id, username, email, cargo };
    const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '200m' });
    const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '1000m' });
    return ({ accessToken, refreshToken });

}

module.exports = { jwtTokens }