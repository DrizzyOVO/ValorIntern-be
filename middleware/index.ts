import jwt from 'jsonwebtoken'; 
export const SECRET = "SecDriSu";  
import { Response, Request, NextFunction } from 'express'; 

export const authenticateJwt = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization; 
    if(authHeader){ 
        const token = authHeader.split(' ')[1]; 
        jwt.verify(token, SECRET, (err, payload) => {
            // if(err){ 
            //     return res.sendStatus(403); 
            // }
            if(err || !payload || typeof payload == "string"){ 
                return res.sendStatus(403); 
            }
            // if(typeof payload == "string") { 
            //     return res.sendStatus(403); 
            // }
            // if(typeof payload == "string") { 
            //     return res.sendStatus(403); 
            // }
            req.headers["userId"] = payload.id; 
            next(); 
        });  

    } else{ 
        console.log("Nooooooooooooo");
        return res.sendStatus(401).json("Nooooooooo");  
    } 
}

