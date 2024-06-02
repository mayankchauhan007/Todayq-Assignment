import express, { Request, Response } from "express";
import Razorpay from "razorpay";
import { Content, Order, User } from "../db/db";
import * as crypto from "crypto";
import { authenticateUser } from "../middlewares/auth";

const paymentRouter = express.Router();

paymentRouter.post(
    "/order",
    authenticateUser,
    async (req: Request, res: Response) => {
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
    }
);

paymentRouter.post(
    "/order/verification/",
    authenticateUser,
    async (req: Request, res: Response) => {
        try {
            console.log(req.body);
            const {
                paymentId,
                orderId,
                razorpaySign,
                userId,
                contentId,
                quantity,
                amount,
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

            const content = await Content.findById(contentId);
            if (!content) {
                return res.status(404).send("Content item not found");
            }

            const order = new Order({
                paymentId,
                orderId,
                razorpaySign,
                userId,
                items: [{ contentId, quantity, amount }],
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

paymentRouter.get(
    "/order/:userId",
    authenticateUser,
    async (req: Request, res: Response) => {
        try {
            const userId = req.params.userId;
            const orders = await Order.find({ userId }).populate(
                "items.contentId"
            );
            if (!orders) {
                return res.status(404).send("No orders found for the user");
            }
            res.status(200).send(orders);
        } catch (error) {
            res.status(500).send("Error while fetching orders: " + error);
            console.log(error);
        }
    }
);

export = paymentRouter;
