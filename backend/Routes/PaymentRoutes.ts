import express, { Request, Response } from "express";
import Razorpay from "razorpay";
import { Food, Order, User } from "../db/db";
import * as crypto from "crypto";

const paymentRouter = express.Router();

paymentRouter.post("/order", async (req: Request, res: Response) => {
    try {
        const razorpay = new Razorpay({
            key_id: "rzp_test_Kqzx3o2RzIs61V",
            key_secret: "tWArl6JkNGFNC8zgMQVVKNyP",
        });
        const options = req.body;
        const order = await razorpay.orders.create(options);

        if (!order) {
            return res.status(500).send("Error placing razorpay order !!");
        }
        console.log(order);
        res.send(order);
    } catch (error) {
        res.status(500).send("Error while creating order" + error);
        console.log(error);
    }
});

paymentRouter.post(
    "/order/verification/",
    async (req: Request, res: Response) => {
        try {
            console.log(req.body);
            const {
                paymentId,
                orderId,
                razorpaySign,
                userId,
                foodId,
                quantity,
                amount
            } = req.body;
            const body = orderId + "|" + paymentId;
            const sha = crypto.createHmac("sha256", "tWArl6JkNGFNC8zgMQVVKNyP");
            sha.update(body.toString());
            const digest = sha.digest("hex");

            if (digest != razorpaySign) {
                return res.status(400).send("Payment is not valid");
            }

            const user = await User.findById(userId);
            if (!user) {
                return res.status(404).send("User not found");
            }

            const food = await Food.findById(foodId);
            if (!food) {
                return res.status(404).send("Food item not found");
            }

            const order = new Order({
                paymentId,
                orderId,
                razorpaySign,
                userId,
                items: [{ foodId, quantity, amount }],
            });

            await order.save();

            user.purchaseHistory.push(order._id);
            await user.save();

            res.send({
                msg: "success",
                orderId,
                paymentId,
            });
        } catch (error) {
            console.log(error);
            res.status(500).send("Internal server Error " + error);
        }
    }
);

export = paymentRouter;
