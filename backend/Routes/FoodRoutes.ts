import express, { Request, Response } from "express";
import { authenticateAdmin, authenticateUser } from "../middlewares/auth";
import { Food } from "../db/db";

const foodRouter = express.Router();
foodRouter.use(express.json());

// get all
foodRouter.get("/", async (req: Request, res: Response) => {
    try {
        const allFoods = await Food.find().exec();
        if (allFoods.length === 0) {
            res.status(200).json({ message: "No foods found." });
        } else {
            res.status(200).json(allFoods);
        }
    } catch (error) {
        console.log(error);
        res.status(500).send("Internal server error.");
    }
});

// get by id
foodRouter.get("/:id", async (req: Request, res: Response) => {
    try {
        const _id = req.params.id;
        const localFood = await Food.findById(_id);
        if (!localFood) {
            res.status(400).json({ message: "No foods found with id :" + _id });
        } else {
            res.status(200).json(localFood);
        }
    } catch (error) {
        console.log(error);
        res.status(500).send("Internal server error.");
    }
});

foodRouter.post("/",  authenticateAdmin,async (req: Request, res: Response) => {
    try {
        const { name } = req.body;
        const local = await Food.findOne({ name });
        if (local) {
            res.status(400).send("food is already present.");
        } else {
            const newFood = new Food(req.body);
            await newFood.save();
            res.json({
                message: "Food item created successfully",
                foodId: newFood.id,
            });
        }
    } catch (error) {
        console.log(error);
        res.status(500).send("Internal server error.");
    }
});

//put mapping
foodRouter.put("/:id",authenticateAdmin, async (req: Request, res: Response) => {
    try {
        const _id = req.params.id;

        const food = await Food.findByIdAndUpdate(_id, req.body, {
            new: true,
        });
        if (food) {
            res.json({ message: "Food item updated successfully" });
        } else {
            res.status(404).json({ message: "Food not found" });
        }
    } catch (error) {
        console.log(error);
        res.status(500).send("Internal server error.");
    }
});

foodRouter.delete("/:id",authenticateAdmin, async (req: Request, res: Response) => {
    try {
        const _id = req.params.id;
        const deletedFood = await Food.findByIdAndDelete(_id);
        if (!deletedFood) {
            res.status(400).send("Food with" + _id + "not found");
        }
        res.status(200).send("Food Deleted Successfully !");
    } catch (error) {
        console.log(error);
        res.status(500).send("Internal server error.");
    }
});

export = foodRouter;
