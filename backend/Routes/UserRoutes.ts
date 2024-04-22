import express, { Request, Response } from "express";
import { User } from "../db/db";

import jwt from "jsonwebtoken";

const SECRET = "mayank";
const userRouter = express.Router();

interface AuthenticatedRequest extends Request {
    user: any;
    role: any; // User type from your User model
}

userRouter.post("/signup", async (req: Request, res: Response) => {
    try {
        const user = req.body;
        const { email } = req.body;
        const local = await User.findOne({ email });
        if (local) {
            return res.status(400).send("User is already present");
        }
        const newUser = new User(user);
        await newUser.save();
        const token = jwt.sign({ email, role: "user" }, SECRET, {
            expiresIn: "1h",
        });
        return res.status(200).send(token);
    } catch (error) {
        console.log(error);
        return res.status(500).send("Internal Server Error");
    }
});

userRouter.post("/login", async (req: AuthenticatedRequest, res: Response) => {
    try {
        const user = req.body;
        // console.log(user);
        const { email, password } = user;
        const local = await User.findOne({ email, password });
        if (!local) {
            res.status(403).send("Invalid Credentials ..");
        }
        const token = jwt.sign({ email, role: "user" }, SECRET, {
            expiresIn: "1h",
        });
        req.user = user;
        req.role = local.role;
        res.status(200).send(token);
    } catch (error) {
        console.log(error);
        return res.status(500).send("Internal Server Error");
    }
});



userRouter.get("/me/:_email", async (req:Request,res:Response)=>{
    try{
        const email = req.params._email;
    const local = await User.findOne({email});
    if(!local){
        res.status(400).send("User with the given Email doesn't exist");
    }
    else{
        res.status(200).json(local);
    }
    }catch(error){
        console.log(error);
        res.status(500).send(error);
    }

})

export = userRouter;
