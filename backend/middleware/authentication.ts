const jwt = require("jsonwebtoken");
import type { Request, Response,NextFunction } from "express";
declare global {
  namespace Express {
    interface Request {
      user?: string | object;
    }
  }
}
// This function checks if the user logged in
const authentication = (req:Request, res:Response, next:NextFunction) => {
  try {
    if (!req.headers.authorization) {
      return res.status(403).json({
        success: false,
        message: `Forbidden`,
      });
    }
    const token = req.headers.authorization.split(" ").pop();

    jwt.verify(token, process.env.JWT_SECRET, (err:any, result:any) => {
      if (err) {
        res.status(403).json({
          success: false,
          message: `The token is invalid or expired`,
        });
      } else {
        req.user = result;
        next();
      }
    });
  } catch (err:any) {
    res.status(500).json({
      success: false,
      message: `Server Error`,
      err: err.message,
    });
  }
};

module.exports = authentication;
