const { extractToken } = require("../jwt");
const getError = require("../sequelizeError");
const pkg = require("jsonwebtoken");
const { verify } = pkg;
const validateToken = () => {
  return async (req, res, next) => {
    try {

      const token = extractToken(req);
      if (token) {
        const data = verify(token, process.env.JWT_ACCESS_SECRET);
        if (data) {
          let temp = { ...data };
          delete temp.iat;
          delete temp.exp;
          req.user = temp;

          req.database = "automation_" + temp.tenant

          if (!req.user.customerAdmin) {
            const allowed = await req.user.permissions.some((permission) => {
              return (
                "Execute" == permission.name && permission["add"] == true
              );
            });
            if (!allowed) return res.status(401).json({ error: "Unauthorized" });
          }
          next();
        }
      } else {
        return res.status(401).json({ error: "Access token not found" });
      }
    } catch (e) {
      getError(e, res, "Access");
    }
  };
};
module.exports = { validateToken };
