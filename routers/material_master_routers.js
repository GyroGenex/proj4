const express = require('express');
const materialMasterController = require('../controllers/material_master_controller');
const authMiddleware = require("../middlewares/auth_middleware");
const router = express.Router();



router.post('/', authMiddleware, materialMasterController.createMaterial);
router.get('/', materialMasterController.showMasterData);
router.get('/:materialId', materialMasterController.getDetails);
router.delete('/:materialId', authMiddleware, materialMasterController.deleteMasterData);

module.exports = router;
