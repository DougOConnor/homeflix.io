const { models } = require('../../models');
const getUserIDfromToken = require('../../utils/getUserIDfromToken');

// Resolve the acting user from the passport session or a Bearer token.
// The session only stores {user_id, name}, so hydrate the full record.
const resolveUser = async (req) => {
    if (req.user && req.user.user_id) {
        return await models.user.findByPk(req.user.user_id);
    }
    if (req.headers.authorization) {
        try {
            const user_id = await getUserIDfromToken(req.headers.authorization);
            if (user_id) {
                return await models.user.findByPk(user_id);
            }
        } catch (e) {}
    }
    return null;
};

// Express middleware: 401 when anonymous, 403 when not an admin.
const requireAdmin = async (req, res, next) => {
    try {
        const user = await resolveUser(req);
        if (!user) {
            return res.status(401).send({ error: 'Not logged in' });
        }
        if (!(user.is_admin === true || user.is_admin === 1)) {
            return res.status(403).send({ error: 'Admin access required' });
        }
        req.actingUser = user;
        next();
    } catch (err) {
        next(err);
    }
};

const requireUser = async (req, res, next) => {
    try {
        const user = await resolveUser(req);
        if (!user) {
            return res.status(401).send({ error: 'Not logged in' });
        }
        req.actingUser = user;
        next();
    } catch (err) {
        next(err);
    }
};

module.exports = { resolveUser, requireAdmin, requireUser };
