"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const authorization = (string) => {
    return (req, res, next) => {
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
//# sourceMappingURL=authorization.js.map