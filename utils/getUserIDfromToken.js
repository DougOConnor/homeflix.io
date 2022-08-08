
const getDatabase = require('./getDatabase')
const db = getDatabase()

const getUserIDfromToken = (token) => {
    let data = db.prepare(
        `SELECT user_id
        FROM user_auth_tokens 
        WHERE token = @token
        `).all({token: token.slice(7)})
    if (data.length > 0) {
        return data[0].user_id
    } else {
        return null
    }
}

module.exports = getUserIDfromToken;