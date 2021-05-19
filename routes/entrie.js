const express = require('express');
const router = express.Router();
const isAuth = require('../middlewares/isAuth');
const getEdamamData = require('../controllers/edamam');
const { addEntrie, getEntries, deleteEntrie } = require('../controllers/entrie');

router.get('/get-entries', isAuth, getEntries);
router.put('/create-entrie', isAuth, addEntrie);
router.delete('/delete-entrie/:entrieId', isAuth, deleteEntrie)
router.put('/create-meal', isAuth);
router.post('/get-edamam', getEdamamData);

module.exports = router;