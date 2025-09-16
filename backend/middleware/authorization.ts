import type { Request, Response,NextFunction } from "express";

interface User {
  role: {
    permissions: string[];
  };
}
interface AuthRequest extends Request {
  user?: User;
}
const authorization = (string:string) => {


  return (req:AuthRequest, res:Response, next:NextFunction) => {

    if (!req.user?.role.permissions.includes(string)) {
      return res.status(403).json({
        success: false,
        message: `Unauthorized`,
      });
    }
    next();
  };
};

module.exports = authorization;
