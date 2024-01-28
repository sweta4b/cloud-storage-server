const express = require('express');
const { deleteUser, getUsers } = require('../controllers/userControllers');
const router = express.Router();


router.delete('/users/:userId', deleteUser);
router.get('/users', getUsers);

module.exports = router;
