const axios = require('axios');
const createError = require('../util/error');

const apiKeyFragment = `app_id=${process.env.EDAMAM_APP_ID}&app_key=${process.env.EDAMAM_APP_KEY}`;
const nutritionCalcLink = `https://api.edamam.com/api/food-database/v2/nutrients?${apiKeyFragment}`;
const parserLink = 'https://api.edamam.com/api/food-database/v2/parser?';

const getFoodNutrients = async (parsedArray) => {
    try {
        const calls = parsedArray.map(i => axios.post(nutritionCalcLink, {ingredients: [i]}));
        return await axios.all(calls);
    } catch (err) {
        throw(err);
    }
}

module.exports = async (req, res, next) => {
    try {
        const { foodName, foodWeight } = req.body;
        const res = await axios.get(`${parserLink}ingr=${encodeURIComponent(foodName)}&${apiKeyFragment}`);
        const foodId = res.data.parsed[0].food.foodId;
        if(!foodId) throw createError(404, 'Invalid food');
        const nutrients = await axios.post(nutritionCalcLink, {
            ingredients: [{
                quantity: foodWeight,
                measureURI: 'http://www.edamam.com/ontologies/edamam.owl#Measure_gram',
                foodId
            }]
        });
        const { calories, totalNutrients } = nutrients.data;
        req.foodData = {
            carb: Math.round(totalNutrients.CHOCDF.quantity),
            fat: Math.round(totalNutrients.FAT.quantity),
            protein: Math.round(totalNutrients.PROCNT.quantity)
        };
        next();
    } catch (err) {
        next(err);
    }
};
// Body format
// {
//     foods: ["rice", "chicken", ...],
//     amounts: [200, 300, ...]
// }