import mongoose from "mongoose";

// userschema
const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String,
    address: String,
    role: {
        type: String,
        default: "user", // Default value for the role field
    },
});

const foodSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    category: {
        type: String,
        required: true,
    },
    imageUrl: {
        type: String,
        required: true,
    },
});

const cartSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    items: [
        {
            foodId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Food",
                required: true,
            },
            quantity: {
                type: Number,
                default: 1,
            },
        },
    ],
});
export const Cart = mongoose.model("cart", cartSchema);
export const User = mongoose.model("User", userSchema);
export const Food = mongoose.model("Food", foodSchema);
