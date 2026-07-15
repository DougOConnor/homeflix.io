const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');
const multer = require('multer');

const { models } = require('../models');
const { requireUser, requireAdmin } = require('./utils/auth');

const UPLOAD_DIR = path.join(__dirname, '..', 'data', 'uploads');
if (!fs.existsSync(UPLOAD_DIR)) {
    fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, UPLOAD_DIR),
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname).toLowerCase() || '.png';
        cb(null, 'snack-' + Date.now() + ext);
    }
});
const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
        cb(null, ['.png', '.jpg', '.jpeg', '.gif', '.webp'].includes(path.extname(file.originalname).toLowerCase()))
    }
});

// Price is optional — empty/invalid input stores NULL (no price shown)
const normalizePrice = (value) => {
    if (value === undefined || value === null || value === '') return null;
    const parsed = parseFloat(value);
    return isNaN(parsed) ? null : parsed;
};

// Public: available snacks for guests
router.get('/', async (req, res, next) => {
    try {
        const snacks = await models.snacks.findAll({ where: { available: true }, order: [['name', 'ASC']] });
        res.send(snacks);
    } catch (err) {
        next(err);
    }
});

// Admin: all snacks including unavailable
router.get('/all', requireAdmin, async (req, res, next) => {
    try {
        const snacks = await models.snacks.findAll({ order: [['name', 'ASC']] });
        res.send(snacks);
    } catch (err) {
        next(err);
    }
});

// Admin: create a snack
router.post('/', requireAdmin, async (req, res, next) => {
    try {
        const { name, description, price, available } = req.body;
        if (!name) {
            return res.status(400).send({ error: 'Name is required' });
        }
        const snack = await models.snacks.create({
            name: name,
            description: description || '',
            price: normalizePrice(price),
            available: available !== false,
        });
        res.send(snack);
    } catch (err) {
        next(err);
    }
});

// Guest: place a snack order for a showing they're attending
router.post('/order', requireUser, async (req, res, next) => {
    try {
        const { showing_id, items } = req.body;
        if (!showing_id || !Array.isArray(items) || items.length === 0) {
            return res.status(400).send({ error: 'showing_id and items are required' });
        }
        // Snapshot names/prices at order time from the live menu
        const snacks = await models.snacks.findAll({ where: { available: true } });
        const byId = {};
        snacks.forEach(s => { byId[s.snack_id] = s; });
        const orderItems = [];
        items.forEach(item => {
            const snack = byId[item.snack_id];
            const qty = parseInt(item.qty);
            if (snack && qty > 0) {
                orderItems.push({ snack_id: snack.snack_id, name: snack.name, price: snack.price, qty: qty });
            }
        });
        if (orderItems.length === 0) {
            return res.status(400).send({ error: 'No valid items in order' });
        }
        const order = await models.snack_orders.create({
            user_id: req.actingUser.user_id,
            showing_id: showing_id,
            items: JSON.stringify(orderItems),
            created_at: new Date().toISOString(),
        });
        res.send({ status: 'success', order_id: order.order_id, items: orderItems });
    } catch (err) {
        next(err);
    }
});

// Admin: all snack orders for a showing (concessions prep list)
router.get('/orders/:showing_id', requireAdmin, async (req, res, next) => {
    try {
        const orders = await models.snack_orders.findAll({ where: { showing_id: req.params.showing_id } });
        const users = await models.user.findAll({ raw: true });
        const emailById = {};
        users.forEach(u => { emailById[u.user_id] = u.email; });
        res.send(orders.map(order => {
            let items = [];
            try { items = JSON.parse(order.items) || []; } catch (e) {}
            return {
                order_id: order.order_id,
                showing_id: order.showing_id,
                email: emailById[order.user_id] || null,
                items: items,
                created_at: order.created_at,
            };
        }));
    } catch (err) {
        next(err);
    }
});

// Admin: update a snack
router.post('/:id', requireAdmin, async (req, res, next) => {
    try {
        const snack = await models.snacks.findByPk(req.params.id);
        if (!snack) {
            return res.status(404).send({ error: 'Snack not found' });
        }
        const updates = {};
        ['name', 'description'].forEach(key => {
            if (req.body[key] !== undefined) updates[key] = req.body[key];
        });
        if ('price' in req.body) updates.price = normalizePrice(req.body.price);
        if (req.body.available !== undefined) updates.available = req.body.available === true;
        await snack.update(updates);
        res.send(snack);
    } catch (err) {
        next(err);
    }
});

// Admin: upload a snack image
router.post('/:id/image', requireAdmin, upload.single('image'), async (req, res, next) => {
    try {
        const snack = await models.snacks.findByPk(req.params.id);
        if (!snack) {
            return res.status(404).send({ error: 'Snack not found' });
        }
        if (!req.file) {
            return res.status(400).send({ error: 'No image uploaded (png/jpg/gif/webp, max 5MB)' });
        }
        // Clean up the previous image
        if (snack.image_path) {
            const old = path.join(UPLOAD_DIR, path.basename(snack.image_path));
            fs.unlink(old, () => {});
        }
        await snack.update({ image_path: '/uploads/' + req.file.filename });
        res.send(snack);
    } catch (err) {
        next(err);
    }
});

// Admin: delete a snack
router.delete('/:id', requireAdmin, async (req, res, next) => {
    try {
        const snack = await models.snacks.findByPk(req.params.id);
        if (!snack) {
            return res.status(404).send({ error: 'Snack not found' });
        }
        if (snack.image_path) {
            const old = path.join(UPLOAD_DIR, path.basename(snack.image_path));
            fs.unlink(old, () => {});
        }
        await snack.destroy();
        res.send({ status: 'success' });
    } catch (err) {
        next(err);
    }
});

module.exports = router;
