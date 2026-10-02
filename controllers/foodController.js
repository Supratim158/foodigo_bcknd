const { text } = require("body-parser");
const Food = require("../models/foodModel");
const { query } = require("express");
const { patch } = require("../routes/categoryRoute");

module.exports = {
    addFood: async (req, res) => {

        const { title, time, foodTags, category, code, restaurant, description, price, additives, imageUrl } = req.body;

        if(!title || !time || !foodTags || !category || !code || !restaurant || !description || !price || !additives || !imageUrl ){
            return res.status(400).json({status: true, message:"You have a missing field"});
        }

        try {
            const newFood = new Food(req.body);
            await newFood.save();
            res.status(201).json({status: true, message:"Food added successfully"});

        } catch (error) {
            res.status(500).json({status: false, message:error.message});
        }
    },

    getFoodById: async (req, res) => {
        const id = req.params.id;

        try {
            const food = await Food.findById(id);

            res.status(200).json(food);
        } catch (error) {
            res.status(500).json({status: false, message:error.message});
        }
    },

    getRandomFood: async (req, res) => {
        let randomFoodList =[];

        try {
            if(req.params.code){
                randomFoodList = await Food.aggregate([
                    {$match: {code: req.params.code}},
                    {$sample: {size: 3}},
                    {$project: {_v : 0}}
                ]);
            }

            if(!randomFoodList.length){
                randomFoodList = await Food.aggregate([
                    {$sample: {size: 3}},
                    {$project: {_v : 0}}
                ]);
            }

            if(randomFoodList.length){
                res.status(200).json(randomFoodList);
            }

            else{
                res.status(404).json({status: false, message: ' No Food found'})
            }

        } catch (error) {
            res.status(500).json({status: false, message:error.message});
        }
    },

    getFoodByRestaurant: async (req, res) => {
        const id = req.params.id;

        try {
            const foods = await Food.find({restaurant:id});

            res.status(200).json(foods);
        } catch (error) {
            res.status(500).json({status: false, message:error.message});
        }
    },

    getFoodByCategoryAndCode: async (req, res)=> {
        const {category, code} = req.params;

        try {
            const foods = await Food.aggregate([
                {$match:{category: category, code: code, isAvailable: true}},
                {$project: {__v: 0}}
            ]);

            if(foods.length ===0){
                res.status(500).json([]);
            }

            res.status(200).json(foods);
        } catch (error) {
            res.status(500).json({status: false, message:error.message});
        }
    },

    searchFoods: async (req, res) => {
        const search = req.params.search;

        try {
            const results = await Food.aggregate([
                {
                    $search:{
                        index: "foods",
                        text: {
                            query: search,
                            path: {
                                wildcard: "*"
                            }
                        }
                    }
                }
            ]);

            res.status(200).json(results);

        } catch (error) {
            res.status(500).json({status: false, message:error.message});
        }
    },

    getRandomFoodByCategoryAndCode: async (req, res)=> {
        const {category, code} = req.params;


        try {

            let foods;
            
            foods = await Food.aggregate([
                {$match:{category: category, code: code, isAvailable: true}},
                {$sample: {size: 10}}
            ]);

            if(!foods || foods.length ===0){
                foods = await Food.aggregate([
                    {$match:{ code: code, isAvailable: true}},
                    {$sample: {size: 10}}
                ])
            }
            else if(!foods || foods.length ===0){
                foods = await Food.aggregate([
                    {$match:{ code: code, isAvailable: true}},
                    {$sample: {size: 10}}
                ])
            }

            res.status(200).json(foods);

        } catch (error) {
            res.status(500).json({status: false, message:error.message});
        }
    },
}