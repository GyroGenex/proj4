
const express = require('express');
const inventoryController = require('../controllers/inventory_controller');
const authMiddleware = require("../middlewares/auth_middleware");
const router = express.Router();

router.post('/', authMiddleware, inventoryController.createInventory);
router.get('/', inventoryController.showInventory);
router.patch('/block', authMiddleware, inventoryController.blockInventory);
router.patch('/unblock', inventoryController.unblockInventory);
router.delete('/delete', authMiddleware, inventoryController.deleteStock);
router.patch('/blockExpiredStock', inventoryController.blockExpiredStock);



module.exports = router;
