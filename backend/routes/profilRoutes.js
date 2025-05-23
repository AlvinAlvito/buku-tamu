const express = require('express');
const router = express.Router();
const profilController = require('../controllers/profilController');

// router.get('/profil/:id', profilController.getProfilByUserId);
router.put('/profil/:id', profilController.updateProfil);

router.get('/profil/log-user', profilController.getAllUser);


module.exports = router;
