const express = require('express');
const router = express.Router();
const isAuth = require('../middlewares/isAuth');
const getEdamamData = require('../middlewares/edamam');
const {mealValidator} = require('../validators');
const { addEntrie, getEntries, getEntry, deleteEntrie, createMeal ,updateMeal, deleteMeal } = require('../controllers/entrie');

router.get('/get-entries', isAuth, getEntries);
router.get('/get-entry/:entrieId', isAuth, getEntry);
router.put('/create-entrie', isAuth, addEntrie);
router.delete('/delete-entrie/:entrieId', isAuth, deleteEntrie);
router.put('/create-meal/:entrieId', isAuth, mealValidator, createMeal);
router.patch('/update-meal/:mealId', isAuth, mealValidator, updateMeal);
router.delete('/delete-meal/:mealId', isAuth, deleteMeal);
router.post('/get-edamam', getEdamamData, (req, res) => res.status(200).send(req.foodData));

module.exports = router; 