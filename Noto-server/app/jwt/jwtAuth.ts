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

        if (!authHeader) {
            res.status(401).send("No token provided");
            return; 
        }

        const token = authHeader.split(" ")[1];

        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET_KEY as string
        ) as { id: string };

        req.id = decoded.id;

        next();
    } catch (err) {
        console.log("JWT ERROR:", err);
        res.status(401).send("Authorization Error");
        return; 
    }
};
// export const jwtAuth=(req:Request,res:Response,next:NextFunction)=>{
//     try {
//         const decoded =jwt.verify(req.headers.token as string,process.env.JWT_SECRET_KEY as string) as {id:string};
//         if(decoded.id){
//             req.id=decoded.id
//             next()
//         }else{
//             res.status(401).send("Authorization Error")
//         }
//     } catch(err) {
//         res.status(500).send("Authorization Error")
//     }
// }