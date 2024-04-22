import jwt from "jsonwebtoken";
import express, { Request, Response, NextFunction } from "express";
import { User } from "../db/db";

const SECRET = "mayank";

export const authenticateJWT = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const authHeader: string | undefined = req.headers.authorization as string;
    if (authHeader) {
        const strArr: string[] = authHeader.split(" ");
        const token: string = strArr[1];
        if (!token) {
            return res.status(401).send("Invalid token");
        }
        let decodedToken: any;
        decodedToken = jwt.verify(token, SECRET);
        const { email } = decodedToken;
        const local = await User.findOne({ email });
        if (!local) {
            res.status(403).send("Not Authorised");
        } else {
            res.status(200).send(" User Created .." + token);
        }
    } else {
        res.status(403).send("Not Authorised");
    }
};

