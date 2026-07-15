const express = require('express');
const router = express.Router();
const { models } = require("../models")

router.get(
  '/',
  async (req, res, next) => {
    try {
      let user = await models.user.findOne({where :{user_id: req.user.user_id}, attributes: ["email", "user_id", "is_admin"]} );
      if (!user) {
        res.status(404).send("User not found");
        return;
      } else {
        res.json(user);
      }
      
    } catch (error) {
      console.log(error);
      res.status(500).send("An error occurred");
    }
  }
);

module.exports = router;