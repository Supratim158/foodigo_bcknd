const router = require('express').Router();
const restaurantController = require('../controllers/restaurantControllers');

router.post("/", restaurantController.addRestaurant);

router.get("/:code", restaurantController.getRandomRestaurant);

router.get("/all/:code", restaurantController.getAllNearbyRestaurant);

router.get("/byId/:id", restaurantController.getRestaurantbyId);

module.exports = router;