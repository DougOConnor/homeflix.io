const Base = require("./Base")

class Auth extends Base {

    add(user_id, token) {
        this.db.prepare(
            `
            INSERT INTO user_auth_tokens
            (user_id, token)
            VALUES
            (@user_id, @token)
            `
        ).run({user_id: user_id, token: token})
    }

}

module.exports = Auth;