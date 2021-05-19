const express = require('express');
const router = express.Router();
const isAuth = require('../middlewares/isAuth');
const { addEntrie, getEntries, deleteEntrie } = require('../controllers/entrie');

router.get('/get-entries', isAuth, getEntries);
router.put('/create-entrie', isAuth, addEntrie);
router.delete('/delete-entrie/:entrieId', isAuth, deleteEntrie)


module.exports = router;