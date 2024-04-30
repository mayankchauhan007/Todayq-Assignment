import jwt from "jsonwebtoken";
// import express, { Request, Response, NextFunction } from "express";
// import { User } from "../db/db";

import { NextFunction, Request, Response } from "express";

const SECRET = "mayank";

// export const authenticateUserJWT = async (
//     req: Request,
//     res: Response,
//     next: NextFunction
// ) => {
//     const authHeader: string | undefined = req.headers.authorization as string;
//     if (authHeader) {
//         const token: string = authHeader;
//         if (!token) {
//             return res.status(401).send("Invalid token");
//         }
//         let decodedToken: any;
//         decodedToken = jwt.verify(token, SECRET);
//         const { email } = decodedToken;
//         const local = await User.findOne({ email });
//         if (!local) {
//             res.status(403).send("Not Authorised");
//         } else {
//             res.status(200).send(" User Created .." + token);
//         }
//     } else {
//         res.status(403).send("Not Authorised");
//     }
// };
type UserRole = 'user' | 'admin';

// User Authentication Middleware
export const authenticateUser = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const authHeader: string | undefined = req.headers.authorization as string;
    if (!authHeader) {
        return res.status(401).send("Unauthorized: Missing Authorization Header");
    }
    const token: string = authHeader;
    try {
        const decodedToken: any = jwt.verify(token, SECRET);
        // console.log(decodedToken);
        if (!decodedToken || !decodedToken.email || !decodedToken.role || decodedToken.role !== 'user' ) {
            return res.status(403).send("Forbidden: Access Denied");
        }
        // req.user = decodedToken; // Attach decoded user info to the request object
        next();
    } catch (error) {
        return res.status(401).send("Unauthorized: Invalid Token");
    }
};

// Admin Authentication Middleware
export const authenticateAdmin = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const authHeader: string | undefined = req.headers.authorization as string;
    if (!authHeader) {
        return res.status(401).send("Unauthorized: Missing Authorization Header");
    }
    const token: string = authHeader;
    try {
        const decodedToken: any = jwt.verify(token, SECRET);
        if (!decodedToken || !decodedToken.email || !decodedToken.role || decodedToken.role !== 'admin') {
            return res.status(403).send("Forbidden: Access Denied");
        }
        // req.user = decodedToken; // Attach decoded user info to the request object
        next();
    } catch (error) {
        return res.status(401).send("Unauthorized: Invalid Token");
    }
};

