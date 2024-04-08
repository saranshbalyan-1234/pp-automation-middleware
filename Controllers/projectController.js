const db = require("../Utils/dataBaseConnection");

const UserProject = db.userProjects;
const Project = db.projects;
const User = db.users;



const getProjectById = async (req) => {
  const projectId = req.body.projectId

  try {

    const project = await Project.schema(req.database).findByPk(projectId, {
      attributes: [
        "id",
        "name",
      ],
      include: [
        {
          model: UserProject.schema(req.database),
          as: "members",
          paranoid: false,
          include: [
            {
              model: User.schema(req.database),
              attributes: [
                "id",
                "name",
                "email",
              ],
            },
          ],
        },
      ],
    });

    let temp = { ...project.dataValues };

    temp.members = temp.members.map((user) => {
      return user.dataValues.user.dataValues
    });

    return temp
  } catch (error) {
    console.log(error)
  }
};


module.exports = { getProjectById };
