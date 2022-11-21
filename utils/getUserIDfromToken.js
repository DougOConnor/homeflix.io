
const { models } = require('../models');

const getUserIDfromToken = async (token) => {
    let user = await models.auth_tokens.findOne({where: {token: token.slice(7)}})
    if (user.user_id != undefined) {
        return user.user_id
    } else {
        return null
    }
}

module.exports = getUserIDfromToken;