const router = require('express').Router();
const foodController = require('../controllers/foodController');

router.post("/", foodController.addFood);

router.get("/recommendation/:code", foodController.getRandomFood);

router.get("/restaurant-food/:id", foodController.getFoodByRestaurant);

router.get("/search/:search", foodController.searchFoods);

router.get("/byId/:id", foodController.getFoodById);

router.get("/:category/:code", foodController.getFoodByCategoryAndCode);

router.get("/:id", foodController.getFoodById);

module.exports = router;
