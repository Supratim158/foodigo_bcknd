const path = require('path');
const backendDir = path.resolve(__dirname, '../food_delivery_backend');
require(path.join(backendDir, 'node_modules/dotenv')).config({ path: path.join(backendDir, '.env') });
const mongoose = require(path.join(backendDir, 'node_modules/mongoose'));

const Restaurant = require(path.join(backendDir, 'models/restaurantModel'));
const Food = require(path.join(backendDir, 'models/foodModel'));
const Category = require(path.join(backendDir, 'models/categoryModel'));
const Order = require(path.join(backendDir, 'models/orderModel'));

async function seed() {
    try {
        console.log('Connecting to MongoDB at:', process.env.MONGOURL);
        await mongoose.connect(process.env.MONGOURL);
        console.log('MongoDB Connected successfully.');

        // Clear existing mock data
        await Restaurant.deleteMany({ code: '41007428' });
        await Category.deleteMany({});
        await Order.deleteMany({ orderNumber: 'CD-8842' });

        // Seed Categories matching Mockup 1
        const categories = [
            { title: 'All', value: 'all', imageUrl: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=150&q=80' },
            { title: 'Burgers', value: 'burger', imageUrl: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=150&q=80' },
            { title: 'Asian Fusion', value: 'asian fusion', imageUrl: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=150&q=80' },
            { title: 'Wood-fired', value: 'wood-fired', imageUrl: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=150&q=80' },
            { title: 'Tacos', value: 'tacos', imageUrl: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?auto=format&fit=crop&w=150&q=80' }
        ];
        await Category.insertMany(categories);
        console.log('Categories seeded.');

        // Seed Restaurants
        const smashcraft = new Restaurant({
            title: 'SmashCraft Burgers',
            time: '15-25 min',
            imageUrl: 'https://images.unsplash.com/photo-1586190848861-99aa4a171e90?auto=format&fit=crop&w=1000&q=80',
            logoUrl: 'https://images.unsplash.com/photo-1586190848861-99aa4a171e90?auto=format&fit=crop&w=200&q=80',
            owner: 'Marcus Soho Group',
            code: '41007428',
            rating: 4.9,
            ratingCount: '1.2k+',
            verification: 'Verified',
            verificationMessage: 'Verified Partner • Artisanal Griddle',
            pickup: true,
            delivery: true,
            isAvailable: true,
            coords: {
                id: 'sc-01',
                latitude: 40.7258,
                longitude: -73.9980,
                title: 'SmashCraft Burgers - Soho',
                address: '0.8 miles away'
            }
        });
        await smashcraft.save();

        const tokyoNoodle = new Restaurant({
            title: 'Tokyo Noodle Bar',
            time: '20-30 min',
            imageUrl: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=1000&q=80',
            logoUrl: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=200&q=80',
            owner: 'Kenji Ramen Corp',
            code: '41007428',
            rating: 4.8,
            ratingCount: '850+',
            verification: 'Verified',
            verificationMessage: 'Trending Fast • Authentic Broth',
            pickup: true,
            delivery: true,
            isAvailable: true,
            coords: {
                id: 'tn-02',
                latitude: 40.7290,
                longitude: -73.9910,
                title: 'Tokyo Noodle Bar',
                address: '1.4 miles away'
            }
        });
        await tokyoNoodle.save();

        const bellaNapoli = new Restaurant({
            title: 'Bella Napoli Pizzeria',
            time: '25-35 min',
            imageUrl: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=1000&q=80',
            logoUrl: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=200&q=80',
            owner: 'Napoli Craft Wood Co',
            code: '41007428',
            rating: 4.9,
            ratingCount: '2.1k+',
            verification: 'Verified',
            verificationMessage: 'Eco Packaging • Wood-fired',
            pickup: true,
            delivery: true,
            isAvailable: true,
            coords: {
                id: 'bn-03',
                latitude: 40.7210,
                longitude: -73.9950,
                title: 'Bella Napoli Pizzeria',
                address: '2.1 miles away'
            }
        });
        await bellaNapoli.save();
        console.log('Restaurants seeded.');

        // Seed Foods for SmashCraft
        await Food.deleteMany({ restaurant: smashcraft._id });
        const foods = [
            {
                title: 'Double Truffle Smash',
                time: '15 min',
                foodTags: ["CHEF'S PICK", 'Popular', 'Signature Burgers'],
                category: 'burger',
                foodType: ['Beef', 'Gourmet', 'Truffle'],
                code: '41007428',
                isAvailable: true,
                restaurant: smashcraft._id,
                rating: 4.9,
                ratingCount: '540',
                description: 'Two dry-aged beef patties, black truffle aioli, melted gruyere, brioche bun.',
                price: 14.50,
                imageUrl: ['https://images.unsplash.com/photo-1586190848861-99aa4a171e90?auto=format&fit=crop&w=600&q=80'],
                additives: []
            },
            {
                title: 'Crispy Hot Honey Chicken',
                time: '15 min',
                foodTags: ['SPICY', 'Popular'],
                category: 'burger',
                foodType: ['Chicken', 'Spicy', 'Crispy'],
                code: '41007428',
                isAvailable: true,
                restaurant: smashcraft._id,
                rating: 4.8,
                ratingCount: '380',
                description: 'Buttermilk fried chicken breast, spicy habanero honey glaze, house slaw, pickles.',
                price: 13.25,
                imageUrl: ['https://images.unsplash.com/photo-1625813506062-0aeb1d7a094b?auto=format&fit=crop&w=600&q=80'],
                additives: []
            },
            {
                title: 'Truffle Parmesan Fries',
                time: '10 min',
                foodTags: ['VEGETARIAN', 'Popular', 'Loaded Sides'],
                category: 'burger',
                foodType: ['Sides', 'Crispy', 'Fries'],
                code: '41007428',
                isAvailable: true,
                restaurant: smashcraft._id,
                rating: 4.9,
                ratingCount: '620',
                description: 'Hand-cut crispy fries tossed in white truffle oil and aged parmesan.',
                price: 6.50,
                imageUrl: ['https://images.unsplash.com/photo-1576107232684-1279f3908594?auto=format&fit=crop&w=600&q=80'],
                additives: []
            },
            {
                title: 'Salted Caramel Milkshake',
                time: '5 min',
                foodTags: ['DESSERT', 'Drinks'],
                category: 'beverages',
                foodType: ['Shake', 'Sweet', 'Drink'],
                code: '41007428',
                isAvailable: true,
                restaurant: smashcraft._id,
                rating: 4.9,
                ratingCount: '290',
                description: 'Hand-spun vanilla bean custard, salted caramel ribbon, whipped cream topping.',
                price: 5.75,
                imageUrl: ['https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&w=600&q=80'],
                additives: []
            }
        ];
        await Food.insertMany(foods);
        console.log('Foods seeded.');

        // Seed Sample Order #CD-8842
        const sampleOrder = new Order({
            orderNumber: 'CD-8842',
            restaurant: {
                id: smashcraft._id.toString(),
                name: 'SmashCraft Burgers - Soho',
                address: '0.8 miles away',
                imageUrl: 'https://images.unsplash.com/photo-1586190848861-99aa4a171e90?auto=format&fit=crop&w=400&q=80'
            },
            items: [
                {
                    title: 'Double Oklahoma Smashed Cheeseburger',
                    price: 14.50,
                    quantity: 1,
                    customization: 'Brioche bun, extra secret craft sauce'
                },
                {
                    title: 'Garlic Parmesan Truffle Fries',
                    price: 7.20,
                    quantity: 1,
                    customization: 'Large cut, herb seasoned'
                },
                {
                    title: 'Vanilla Salted Caramel Milkshake',
                    price: 6.00,
                    quantity: 1,
                    customization: 'Whipped cream topping'
                }
            ],
            deliveryAddress: {
                address: '742 Evergreen Terr, Apt 4B',
                city: 'Springfield',
                tag: 'Home',
                instructions: 'Leave at apartment door, ring bell'
            },
            subtotal: 25.50,
            discount: 5.00,
            deliveryFee: 0.00,
            tax: 3.20,
            driverTip: 4.00,
            total: 27.70,
            paymentMethod: 'Apple Pay',
            paymentCardLast4: '9412',
            deliveryPin: '4892',
            status: 'out_for_delivery',
            estimatedDeliveryTime: '14 mins',
            estimatedDeliveryTimestamp: '7:42 PM',
            courier: {
                name: 'Marcus D.',
                phone: '+1 (555) 321-7890',
                rating: 4.98,
                deliveryCount: 1840,
                vehicle: 'E-Bike • Black Trek',
                avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
                isTopCourier: true,
                location: {
                    latitude: 40.7258,
                    longitude: -73.9980
                }
            }
        });
        await sampleOrder.save();
        console.log('Sample order CD-8842 seeded successfully!');

        process.exit(0);
    } catch (e) {
        console.error('Error during seeding:', e);
        process.exit(1);
    }
}

seed();
