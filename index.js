const express = require('express');
const cors = require('cors');
const app = express();
const dotenv = require('dotenv');
const mongoose = require('mongoose');

const CategoryRoute = require('./routes/categoryRoute');
const RestaurantRoute = require('./routes/restaurantRoute');
const FoodRoute = require('./routes/foodRoute');
const RatingRoute = require('./routes/ratingRoute');
const OrderRoute = require('./routes/orderRoute');
const UserRoute = require('./routes/userRoutes');

dotenv.config();

mongoose.connect(process.env.MONGOURL)
  .then(() => { console.log('Foodigo DB connected'); })
  .catch((err) => { console.log(err); });

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/auth', UserRoute);
app.use('/api/users', UserRoute);
app.use('/api/category', CategoryRoute);
app.use('/api/restaurant', RestaurantRoute);
app.use('/api/foods', FoodRoute);
app.use('/api/rating', RatingRoute);
app.use('/api/orders', OrderRoute);

// Root healthcheck endpoint
app.get('/', (req, res) => {
  res.json({ status: true, message: 'CraveDrop / Foodigo API is running' });
});

const PORT = process.env.PORT || 1508;
app.listen(PORT, () => console.log(`Foodigo Server running on port: ${PORT}`));
