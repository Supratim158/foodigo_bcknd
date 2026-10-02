const Restaurant = require("../models/restaurantModel");

module.exports = {

    addRestaurant : async (req,res)=> {
        const { title, time, imageUrl, owner, code, logoUrl, coords } = req.body;

        if(!title || !time || !imageUrl || !owner || !code || !logoUrl || !coords || !coords.latitude || !coords.longitude || !coords.address || !coords.title ){
            return res.status(400).json({status: true, message:"You have a missing field"});
        }
        try {
            const newRestaurant = new Restaurant(req.body);

            await newRestaurant.save();

            res.status(201).json({status: true, message:"Restaurant added Successfully"});

        } catch (error) {
            res.status(500).json({status: false, message:error.message});
        }
    },

    getRestaurantbyId : async (req,res)=> {
        const id = req.params.id;
        try {
            const restaurant = await Restaurant.findById(id);

            res.status(200).json(restaurant);


        } catch (error) {
            res.status(500).json({status: false, message:error.message});
        }
    },

    getAllNearbyRestaurant : async (req,res)=> {
        const code = req.params.code;
        try {
            let allNearbyRestaurants = [];

            if(code){
                allNearbyRestaurants = await Restaurant.aggregate([
                    {$match: {isAvailable: true}},
                    {$project: {__v:0}},
                ]);
            }

            if(allNearbyRestaurants.length === 0){
                allNearbyRestaurants = await Restaurant.aggregate([
                    {$match: {isAvailable: true}},
                    {$project: {__v:0}},
                ]);
            }

            res.status(200).json(allNearbyRestaurants);

        } catch (error) {
            res.status(500).json({status: false, message:error.message});
        }
    },

    getRandomRestaurant : async (req,res)=> {
        const code = req.params.code;
        try {
            let randomRestaurants = [];

            if(code){
                randomRestaurants = await Restaurant.aggregate([
                    {$match: {isAvailable: true}},
                    {$sample: {size:5}},
                    {$project: {__v:0}},
                ]);
            }

            if(randomRestaurants.length === 0){
                randomRestaurants = await Restaurant.aggregate([
                    {$match: {isAvailable: true}},
                    {$sample: {size:5}},
                    {$project: {__v:0}},
                ]);
            }

            res.status(200).json(randomRestaurants);

        } catch (error) {
            res.status(500).json({status: false, message:error.message});
        }
    },
}