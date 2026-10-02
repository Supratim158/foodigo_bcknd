const mongoose = require('mongoose');

const OrderItemSchema = new mongoose.Schema({
    foodId: { type: String },
    title: { type: String, required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, default: 1 },
    customization: { type: String, default: '' },
    imageUrl: { type: String }
});

const OrderSchema = new mongoose.Schema({
    orderNumber: { type: String, required: true, unique: true },
    userId: { type: String, default: "user_cravedrop_01" },
    customerName: { type: String, default: "Alex Johnson" },
    restaurant: {
        id: { type: String },
        name: { type: String, required: true },
        address: { type: String, default: "Soho, New York" },
        imageUrl: { type: String }
    },
    items: [OrderItemSchema],
    deliveryAddress: {
        address: { type: String, default: "742 Evergreen Terr, Apt 4B" },
        city: { type: String, default: "Springfield" },
        tag: { type: String, default: "Home" },
        instructions: { type: String, default: "Leave at apartment door, ring bell" }
    },
    subtotal: { type: Number, required: true },
    discount: { type: Number, default: 0 },
    deliveryFee: { type: Number, default: 0 },
    tax: { type: Number, default: 0 },
    driverTip: { type: Number, default: 4.0 },
    total: { type: Number, required: true },
    paymentMethod: { type: String, default: "Apple Pay" },
    paymentCardLast4: { type: String, default: "9412" },
    status: {
        type: String,
        enum: ["confirmed", "in_kitchen", "out_for_delivery", "delivered", "cancelled"],
        default: "out_for_delivery"
    },
    deliveryPin: { type: String, default: "4892" },
    estimatedDeliveryTime: { type: String, default: "14 mins" },
    estimatedDeliveryTimestamp: { type: String, default: "7:42 PM" },
    courier: {
        name: { type: String, default: "Marcus D." },
        phone: { type: String, default: "+1 (555) 321-7890" },
        rating: { type: Number, default: 4.98 },
        deliveryCount: { type: Number, default: 1840 },
        vehicle: { type: String, default: "E-Bike • Black Trek" },
        avatar: { type: String, default: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80" },
        isTopCourier: { type: Boolean, default: true },
        location: {
            latitude: { type: Number, default: 40.7258 },
            longitude: { type: Number, default: -73.9980 }
        }
    }
}, { timestamps: true });

module.exports = mongoose.model('Order', OrderSchema);
