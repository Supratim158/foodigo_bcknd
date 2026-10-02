const Order = require("../models/orderModel");

module.exports = {
    createOrder: async (req, res) => {
        try {
            const {
                items,
                restaurant,
                subtotal,
                discount,
                deliveryFee,
                tax,
                driverTip,
                total,
                paymentMethod,
                deliveryAddress,
                deliveryInstructions
            } = req.body;

            const randomSuffix = Math.floor(1000 + Math.random() * 9000);
            const orderNumber = req.body.orderNumber || `CD-${randomSuffix}`;
            const deliveryPin = req.body.deliveryPin || `${Math.floor(1000 + Math.random() * 9000)}`;

            const newOrder = new Order({
                orderNumber,
                restaurant: restaurant || {
                    id: "smashcraft_01",
                    name: "SmashCraft Burgers - Soho",
                    address: "0.8 miles away"
                },
                items: items || [],
                subtotal: subtotal || 25.50,
                discount: discount !== undefined ? discount : 5.00,
                deliveryFee: deliveryFee !== undefined ? deliveryFee : 0,
                tax: tax || 3.20,
                driverTip: driverTip !== undefined ? driverTip : 4.00,
                total: total || 27.70,
                paymentMethod: paymentMethod || "Apple Pay",
                paymentCardLast4: "9412",
                deliveryAddress: {
                    address: deliveryAddress?.address || "742 Evergreen Terr, Apt 4B",
                    city: deliveryAddress?.city || "Springfield",
                    tag: deliveryAddress?.tag || "Home",
                    instructions: deliveryInstructions || "Leave at apartment door, ring bell"
                },
                deliveryPin,
                status: "out_for_delivery",
                estimatedDeliveryTime: "14 mins",
                estimatedDeliveryTimestamp: "7:42 PM",
                courier: {
                    name: "Marcus D.",
                    phone: "+1 (555) 321-7890",
                    rating: 4.98,
                    deliveryCount: 1840,
                    vehicle: "E-Bike • Black Trek",
                    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80",
                    isTopCourier: true,
                    location: {
                        latitude: 40.7258,
                        longitude: -73.9980
                    }
                }
            });

            const savedOrder = await newOrder.save();
            res.status(201).json({ status: true, message: "Order placed successfully", data: savedOrder });
        } catch (error) {
            res.status(500).json({ status: false, message: error.message });
        }
    },

    getOrderById: async (req, res) => {
        try {
            const { id } = req.params;
            let order = null;
            if (id.startsWith("CD-") || id.startsWith("cd-")) {
                order = await Order.findOne({ orderNumber: id.toUpperCase() });
            } else if (id.match(/^[0-9a-fA-F]{24}$/)) {
                order = await Order.findById(id);
            }
            
            if (!order) {
                // Fallback search by orderNumber
                order = await Order.findOne({ orderNumber: id });
            }

            if (!order) {
                return res.status(404).json({ status: false, message: "Order not found" });
            }
            res.status(200).json({ status: true, data: order });
        } catch (error) {
            res.status(500).json({ status: false, message: error.message });
        }
    },

    getAllOrders: async (req, res) => {
        try {
            const orders = await Order.find().sort({ createdAt: -1 }).limit(20);
            res.status(200).json({ status: true, data: orders });
        } catch (error) {
            res.status(500).json({ status: false, message: error.message });
        }
    },

    updateOrderStatus: async (req, res) => {
        try {
            const { id } = req.params;
            const { status, courierLocation } = req.body;
            const updateFields = {};
            if (status) updateFields.status = status;
            if (courierLocation) updateFields["courier.location"] = courierLocation;

            const updatedOrder = await Order.findOneAndUpdate(
                { $or: [{ _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : null }, { orderNumber: id }] },
                { $set: updateFields },
                { new: true }
            );

            if (!updatedOrder) {
                return res.status(404).json({ status: false, message: "Order not found" });
            }
            res.status(200).json({ status: true, data: updatedOrder });
        } catch (error) {
            res.status(500).json({ status: false, message: error.message });
        }
    }
};
