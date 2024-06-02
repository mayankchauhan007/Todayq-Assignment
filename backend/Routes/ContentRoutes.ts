import express, { Request, Response } from "express";
import { authenticateAdmin, authenticateUser } from "../middlewares/auth";
import { Content } from "../db/db";

const contentRouter = express.Router();
contentRouter.use(express.json());

// get all
contentRouter.get("/", async (req: Request, res: Response) => {
    try {
        const allContents = await Content.find().exec();
        if (allContents.length === 0) {
            res.status(200).json({ message: "No contents found." });
        } else {
            res.status(200).json(allContents);
        }
    } catch (error) {
        console.log(error);
        res.status(500).send("Internal server error.");
    }
});

// get by id
contentRouter.get("/:id", async (req: Request, res: Response) => {
    try {
        const _id = req.params.id;
        const localContent = await Content.findById(_id);
        if (!localContent) {
            res.status(400).json({
                message: "No contents found with id :" + _id,
            });
        } else {
            res.status(200).json(localContent);
        }
    } catch (error) {
        console.log(error);
        res.status(500).send("Internal server error.");
    }
});

contentRouter.post(
    "/",
    authenticateAdmin,
    async (req: Request, res: Response) => {
        try {
            const { name } = req.body;
            const local = await Content.findOne({ name });
            if (local) {
                res.status(400).send("content is already present.");
            } else {
                const newContent = new Content(req.body);
                await newContent.save();
                res.json({
                    message: "Content item created successfully",
                    contentId: newContent.id,
                });
            }
        } catch (error) {
            console.log(error);
            res.status(500).send("Internal server error.");
        }
    }
);

//put mapping
contentRouter.put(
    "/:id",
    authenticateAdmin,
    async (req: Request, res: Response) => {
        try {
            const _id = req.params.id;

            const content = await Content.findByIdAndUpdate(_id, req.body, {
                new: true,
            });
            if (content) {
                res.json({ message: "Content item updated successfully" });
            } else {
                res.status(404).json({ message: "Content not found" });
            }
        } catch (error) {
            console.log(error);
            res.status(500).send("Internal server error.");
        }
    }
);

contentRouter.delete(
    "/:id",
    authenticateAdmin,
    async (req: Request, res: Response) => {
        try {
            const _id = req.params.id;
            const deletedContent = await Content.findByIdAndDelete(_id);
            if (!deletedContent) {
                res.status(400).send("Content with" + _id + "not found");
            }
            res.status(200).send("Content Deleted Successfully !");
        } catch (error) {
            console.log(error);
            res.status(500).send("Internal server error.");
        }
    }
);

export = contentRouter;
