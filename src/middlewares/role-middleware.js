export const roleMiddleware = (requiredRole) => {
    return (req, res, next) => {
        if (!req.user || req.user.role !== requiredRole) {
            return res.status(403).json({
                errors: `Forbidden: Only ${requiredRole}s can perform this action`
            });
        }
        next();
    };
};
