import express, { Request, Response } from "express";
import { Cart } from "../db/db";
import { escapeLeadingUnderscores } from "typescript";
import { authenticateUser } from "../middlewares/auth";

const cartRouter = express.Router();
cartRouter.use(express.json());

cartRouter.post("/", authenticateUser, async (req: Request, res: Response) => {
    try {
        const { userId, foodId, quantity } = req.body;
        const local = await Cart.findOne({ userId });
        if (!local) {
            console.log("it is not finding local");
            const newCart = new Cart({ userId, items: [{ foodId, quantity }] });
            await newCart.save();
            res.status(201).send(newCart);
        } else {
            const existingItem = local.items.find(
                (item) => item.foodId.toString() === foodId.toString()
            );
            if (!existingItem) {
                local.items.push({ foodId, quantity });
            } else {
                existingItem.quantity += quantity;
            }
            await local.save();
            res.json(local);
        }
    } catch (error) {
        console.log(error);
        res.status(500).send("Internal Server Error : " + error);
    }
});

//
cartRouter.delete("/:userId/:foodId", authenticateUser, async (req: Request, res: Response) => {
    try {
        const { userId, foodId } = req.params;
        const local = await Cart.findOne({ userId });
        console.log(local);
        if (!local) {
            console.log("Cart not found");
        } else {
            const updatedItems = local.items.filter(
                (item) => item.foodId.toString() !== foodId.toString()
            );
            local.items = updatedItems as unknown as typeof local.items; // Cast updatedItems to the type of local.items
            await local.save();
            res.json(local);
        }
    } catch (error) {
        console.log(error);
        res.status(500).send("Internal Server Error : " + error);
    }
});

//

cartRouter.get("/:userId", authenticateUser, async (req: Request, res: Response) => {
    try {
        const userId = req.params.userId;
        const cart = await Cart.findOne({ userId });
        res.status(200).json(cart);
    } catch (error) {
        console.log(error);
        res.status(400).send("Bad Request : " + error);
    }
});

cartRouter.get("/", authenticateUser,async (req: Request, res: Response) => {
    try {
        const cart = await Cart.find();
        res.status(200).json(cart);
    } catch (error) {
        console.log(error);
        res.status(400).send("Bad Request : " + error);
    }
});

export = cartRouter;
