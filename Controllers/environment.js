const db = require("../Utils/dataBaseConnection");
const getError = require("../Utils/sequelizeError");

const Column = db.columns;
const getAllEnvironmentsByTestCase = async (req, res) => {
  /*  #swagger.tags = ["Environment"] 
     #swagger.security = [{"apiKeyAuth": []}]
  */

  try {
    const envId = req.body.environment;
    if (!envId) return {};
    const columns = await Column.schema(req.database).findAll({
      where: {
        envId,
      },
      attributes: ["name", "value"],
    });

    let newKeys = {};
    columns.forEach((el) => {
      newKeys[el.name] = el.value;
    });
    return newKeys;
  } catch (err) {
    getError(err, res);
  }
};
module.exports = { getAllEnvironmentsByTestCase };
