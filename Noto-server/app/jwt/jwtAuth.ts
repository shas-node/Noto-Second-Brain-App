import { NextFunction,Response,Request } from "express";
import jwt from 'jsonwebtoken'
declare global{
    namespace Express{
        interface Request{
            id:string
        }
    }
}
export const jwtAuth = (req: Request, res: Response, next: NextFunction): void => {
    try {
        const authHeader = req.headers.authorization;
        const legacyTokenHeader = req.headers["token"];
        let token: string | undefined;

        if (authHeader?.startsWith("Bearer ")) {
            token = authHeader.split(" ")[1];
        } else if (typeof legacyTokenHeader === "string") {
            token = legacyTokenHeader;
        } else if (Array.isArray(legacyTokenHeader) && legacyTokenHeader[0]) {
            token = legacyTokenHeader[0];
        }

        if (!token) {
            res.status(401).send("No token provided");
            return;
        }

        // Some clients store token with quotes; normalize before verify.
        token = token.trim().replace(/^"|"$/g, "");

        const secret = process.env.JWT_SECRET_KEY;
        if (!secret) {
            res.status(500).send("JWT secret missing on server");
            return;
        }

        const decoded = jwt.verify(token, secret) as { id: string };

        req.id = decoded.id;

        next();
    } catch (err) {
        console.log("JWT ERROR:", err);
        res.status(401).send("Authorization Error");
        return; 
    }
};
