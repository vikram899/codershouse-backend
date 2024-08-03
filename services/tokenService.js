const { JWT_ACCESS_KEY, JWT_REFRESH_KEY } = require("../config");
const jwt = require('jsonwebtoken');

class TokenService{
    async generateToken(user){
        const accessToken = jwt.sign(user, JWT_ACCESS_KEY, {expiresIn: '15m'});
        const refreshToken = jwt.sign(user, JWT_REFRESH_KEY, {expiresIn: '1y'});
        return {accessToken, refreshToken};
    }
}

module.exports = new TokenService();  