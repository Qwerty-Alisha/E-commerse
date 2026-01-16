const express = require('express');
const { fetchUserById, updateUser } = require('../controller/User');

const router = express.Router();

// /users is already added in base path
// 1. WE MUST ADD THIS ROUTE TO HANDLE /users/own
router.get('/own', fetchUserById); 
router.patch('/:id', updateUser);

exports.router = router;