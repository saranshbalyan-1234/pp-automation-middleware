const { Upload } = require("@aws-sdk/lib-storage")
const { S3 } = require("@aws-sdk/client-s3");

const s3 = new S3({
  region: "ap-south-1",
  credentials: {
    accessKeyId: "",
    secretAccessKey: "",
  }
});

const uploadFile = async (file, bucketName, keyName) => {
  // Setting up S3 upload parameters
  const uploadParams = {
    Bucket: bucketName, // Bucket into which you want to upload file
    Key: keyName, // Name by which you want to save it
    Body: file,
  };
  try {

    // S3 ManagedUpload with callbacks are not supported in AWS SDK for JavaScript (v3).
    // Please convert to `await client.upload(params, options).promise()`, and re-run aws-sdk-js-codemod.
    return await new Upload({
      client: s3,
      params: uploadParams
    }).done();

  } catch (error) {
    console.log(error);
  }
};
const createFolder = async (bucketName, folderName) => {
  // Setting up S3 upload parameters
  const uploadParams = {
    Bucket: bucketName, // Bucket into which you want to upload file
    Key: folderName + "/", // Name by which you want to save it
  };
  try {
    s3.putObject(uploadParams);
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
};

module.exports = { uploadFile, createFolder };
