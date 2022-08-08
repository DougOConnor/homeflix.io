const Base = require("./Base")

class User extends Base {

    getUserFromID(user_id) {
        return this.db.prepare(
            `SELECT 
                user_id,
                username,
                email,
                is_admin
            FROM
            users WHERE
            user_id =  @user_id
            `).get({user_id: user_id})
    }

    getUserFromUsername(username) {
        return this.db.prepare(
            `SELECT 
                user_id,
                username,
                email,
                is_admin
            users WHERE
            username =  @username
            `).get({username: username})
    }

    add(username, password, email, is_admin=false) {
        return this.db.prepare(
            `INSERT INTO users 
            (username, password, email, is_admin)
            VALUES (@username, @password, @email, @is_admin)
            returning user_id
            `).run({
                username: username,
                password: password,
                email: email,
                is_admin: is_admin
        })
    }

    updatePassword(user_id, password) {
        return this.db.prepare(
            `UPDATE users SET password = @password WHERE user_id = @user_id`).run({
                user_id: user_id,
                password: password
        })
    }

    updateResetToken(user_id, resetToken) {
        return this.db.prepare(
            `UPDATE users SET reset_token = @reset_token WHERE user_id = @user_id`).run({
                user_id: user_id,
                reset_token: resetToken
        })
    }

    isAdmin(user_id) {
        return this.db.prepare(
            `SELECT is_admin FROM users WHERE user_id = @user_id`).get({user_id: user_id})
    }

}

module.exports = User;