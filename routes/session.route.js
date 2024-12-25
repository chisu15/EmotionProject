const express = require('express');
const router = express.Router();
const controller = require('../controllers/session.controller.js');

router.post('/', controller.index);
router.post('/detail/:id', controller.detail);
router.delete('/delete/:id', controller.delete);

module.exports = router;