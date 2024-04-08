const nodemailer = require("nodemailer")
const failedExecutionHtml = require("../../Utils/Mail/HTML/failedExecution.js")
var transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "saranshbalyan1234@gmail.com",
    pass: "cwybqmfmlrskndfz",
  },
});

const sendMail = async (data, type) => {
  let mailOption = {
    to: "",
    subject: "",
    text: "",
    html: "",
  };
  switch (type) {
    case "failedExecution":
      mailOption = {
        to: data.email,
        subject: "Execution Failed",
        html: failedExecutionHtml(data.testCaseName, data.projectName, data.executedBy, data.status),
      };
      break;
    default:
      break;
  }
  transporter.sendMail(
    { ...mailOption, from: process.env.MAILER_FROM },
    function (error, info) {
      if (error) {
        console.log(error);
        console.log("Failed to send email");
      } else {
        console.log("Email Sent: " + type);
      }
    }
  );
  return true
};
module.exports = { sendMail };
