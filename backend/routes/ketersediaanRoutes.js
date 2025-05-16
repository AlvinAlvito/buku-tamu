const express = require('express');
const router = express.Router();
const ketersediaanController = require('../controllers/ketersediaanController');

router.get('/ketersediaan/:id', ketersediaanController.getKetersediaanByUserId);
router.put('/ketersediaan/:id', ketersediaanController.updateKetersediaan);

module.exports = router;
