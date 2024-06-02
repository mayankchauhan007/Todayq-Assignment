import express, { Express } from "express";
const port: number = 3000;
const app: Express = express();
import cors from "cors";

import mongoose from "mongoose";
import userRouter from "./Routes/UserRoutes";
import contentRouter from "./Routes/ContentRoutes";
import cartRouter from "./Routes/cartRoutes";
import paymentRouter from "./Routes/PaymentRoutes";
app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
    res.send("This is Home Page");
});

app.use("/user", userRouter);
app.use("/contents", contentRouter);
app.use("/cart", cartRouter);
app.use("/payment", paymentRouter);

const startDB = async () => {
    try {
        await mongoose.connect(
            "mongodb+srv://mayank:1UH8sBzovMjw6zWG@cluster0.zzzecoi.mongodb.net/"
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
