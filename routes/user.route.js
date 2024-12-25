const express = require('express');
const router = express.Router();
const controller = require('../controllers/user.controller');

router.post('/', controller.index);
router.post('/detail/:id', controller.detail);
router.post('/create/', controller.create);
router.patch('/edit/:id', controller.edit);
router.delete('/delete/:id', controller.delete);


router.post("/login", controller.login);
router.post("/logout", controller.logout);
module.exports = router;