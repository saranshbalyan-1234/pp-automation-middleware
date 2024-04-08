const validatePermission = (permissionName, method) => {
  return async (req, res, next) => {
    try {
      if (!req.user.customerAdmin) {
        const allowed = await req.user.permissions.some((permission) => {
          return (
            permissionName == permission.name && method == permission[method]
          );
        });
        if (!allowed) return res.status(401).json({ error: "Unauthorized" });
      }
      next();
    } catch (e) {
      return res.status(401).json({ error: e });
    }
  };
};
export { validatePermission };
