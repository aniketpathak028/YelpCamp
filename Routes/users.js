const express = require("express");
const router = express.Router({ mergeParams: true });
const User = require('../models/user');

router.get('/register', (req, res) => {
    res.render('users/register');
})

router.post('/register', async (req, res) => {
    
})

module.exports = router;