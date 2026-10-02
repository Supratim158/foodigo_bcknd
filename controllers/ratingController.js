const Rating = require("../models/ratingModel");
const Restaurant = require("../models/restaurantModel");
const Food = require("../models/foodModel");

module.exports = {
    addRating: async (req, res) => {
        const newRating = new Rating({
            userId: req.body.id,
            ratingType: req.body.ratingType,
            product: req.body.product,
            rating: req.body.rating,
        });

        try {
            await newRating.save();

            if (req.body.ratingType === "Restaurant"){
                const restaurants = await Rating.aggregate([
                    {$match: {ratingType: req.body.ratingType, product: req.body.product}},
                    {$group: {_id: '$product'}, averageRating: {$avg: '$rating'}}
                ]);

                if(restaurants.length>0){
                    const averageRating = restaurants[0].averageRating;
                    await Restaurant.findByIdAndUpdate(req.body.product, {rating: averageRating}, {new: true});
                }
            }

            else if (req.body.ratingType === "Food"){
                const foods = await Rating.aggregate([
                    {$match: {ratingType: req.body.ratingType, product: req.body.product}},
                    {$group: {_id: '$product'}, averageRating: {$avg: '$rating'}}
                ]);

                if(foods.length>0){
                    const averageRating = foods[0].averageRating;
                    await Food.findByIdAndUpdate(req.body.product, {rating: averageRating}, {new: true});
                }
            }

            res.status(200).json({status: true, message: "Rating updated Successfully"});
        } catch (error) {
            res.status(500).json({status: false, message: error.message});
        }
    },

    checkUserRating: async(req, res) => {
        const ratingType = req.query.ratingType;
        const product = req.query.ratingType;

        try {
            const existingRating = await Rating.findOne({
                userId: req.user.id,
                product: product,
                ratingType: ratingType
            });
            
            if(existingRating){
                res.status(200).json({status: true, message: "You have already rated"});
            }
            else {
                res.status(200).json({status: false, message: "User didnt rated"});

            }
        } catch (error) {
            res.status(500).json({status: false, message: error.message});
        }
    }
}