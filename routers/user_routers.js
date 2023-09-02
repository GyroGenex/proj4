
const express = require('express');
const userController = require('../controllers/user_controller');

const router = express.Router();

router.post('/', userController.createUser);
router.get('/:id', userController.findUserById);
router.get('/', userController.showUsers);

router.delete('/:id', userController.deleteUser);
router.post('/login', userController.login);


module.exports = router;
