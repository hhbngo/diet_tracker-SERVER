const axios = require('axios');
const createError = require('../util/error');

const apiKeyFragment = `app_id=${process.env.EDAMAM_APP_ID}&app_key=${process.env.EDAMAM_APP_KEY}`;
const nutritionCalcLink = `https://api.edamam.com/api/food-database/v2/nutrients?${apiKeyFragment}`;
const parserLink = 'https://api.edamam.com/api/food-database/v2/parser?';

const getFoodIds = async (foodNameArray) => {
    try {
        const calls = foodNameArray.map(i => axios.get(`${parserLink}ingr=${encodeURIComponent(i)}&${apiKeyFragment}`));
        return await axios.all(calls);
    } catch (err) {
        throw err;
    }
};

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
        const results = await getFoodIds(req.body.foods);
        const data = results.map(e => e.data);

        let invalidFoodIndexes = [];
        data.forEach((el, i) => {
            if (el.parsed.length === 0) invalidFoodIndexes.push(i);
        });
        if (invalidFoodIndexes.length !== 0) throw createError(404, 'Invalid food(s)', invalidFoodIndexes);

        const foodIds = data.map(el => el.parsed[0].food.foodId);
        const combined = foodIds.map((el, i) => ({
            quantity: req.body.amounts[i],
            measureURI: 'http://www.edamam.com/ontologies/edamam.owl#Measure_gram',
            foodId: el
        }));

        const t = await getFoodNutrients(combined);
        const u = t.map((el, i) => {
            const { calories, totalNutrients } = el.data;
            return {
                name: req.body.foods[i],
                weight: req.body.amounts[i],
                fat: Math.round(totalNutrients.FAT.quantity * 10) / 10,
                carb: Math.round(totalNutrients.CHOCDF.quantity * 10) / 10,
                protein: Math.round(totalNutrients.PROCNT.quantity * 10) / 10,
                calories
            };
        });

        req.foodData = u;
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