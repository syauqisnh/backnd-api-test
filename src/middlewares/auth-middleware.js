import jwt from 'jsonwebtoken';
import { prismaClient } from "../applications/database.js";

export const authMiddleware = async (req, res, next) => {
    const token = req.get("Authorization");

    if (!token) {
        return res.status(401).json({
            errors: "Unauthorized: No token provided"
        });
    }

    const bearerToken = token.split(' ')[1];
    if (!bearerToken) {
        return res.status(401).json({
            errors: "Unauthorized: Invalid token format"
        });
    }

    try {
        const decoded = jwt.verify(bearerToken, process.env.JWT_SECRET_KEY);

        console.log("Decoded token:", decoded); 

        const user = await prismaClient.user.findUnique({
            where: { uuid_user: decoded.uuid_user },
            select: { role: true, token: true, uuid_user: true }
        });

        if (!user) {
            return res.status(401).json({
                errors: "Unauthorized: User not found"
            });
        }

        if (user.token !== bearerToken) {
            return res.status(401).json({
                errors: "Unauthorized: Invalid token"
            });
        }

        req.user = user;
        console.log("User after authMiddleware:", req.user);

        next();
    } catch (error) {
        console.error("Token verification error:", error);
        return res.status(401).json({
            errors: "Unauthorized: Token is invalid or expired"
        });
    }
};
