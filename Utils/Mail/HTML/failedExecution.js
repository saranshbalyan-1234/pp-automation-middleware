const failedExecution = (testCaseName, projectName, executedBy, status) => {
    return (
        `<!DOCTYPE html>
        <html>
            <body>
                <p>This is to inform you that latest Execution for TestCase: ${testCaseName} under Project: ${projectName} has been ${status}.</p>
                Executed By: ${executedBy}
                </body>
        </html>`);
};
module.exports = failedExecution;
