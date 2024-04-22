import express, { Express } from "express";
const port: number = 3000;
const app: Express = express();
import cors from "cors";

import mongoose from "mongoose";
import userRouter from "./Routes/UserRoutes";
import foodRouter from "./Routes/FoodRoutes";
import cartRouter from "./Routes/cartRoutes";
app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
    res.send("This is Home Page");
});


app.use("/user", userRouter);
app.use("/foods", foodRouter);
app.use("/cart", cartRouter);

const startDB = async () => {
    try {
        await mongoose.connect(
            "mongodb+srv://mayank:zUNPGZpuks7nSfEQ@cluster0.ycro9jx.mongodb.net/ecommerce"
        );
        console.log("Mongodb is connected!!!");
        app.listen(port, () => {
            console.log(`Server is listening on port ${port}...`);
        });
    } catch (error) {
        console.log(error);
    }
};
// connecting to Mongodb and starting the server
startDB();
