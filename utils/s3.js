const AWS = require('aws-sdk');
const { v4: uuid } = require('uuid');

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

const uploadToS3 = async (buffer, mimetype, userId) => {
  const filename = `avatars/${userId}-${uuid()}.png`;

  const params = {
    Bucket: process.env.S3_BUCKET_NAME,
    Key: filename,
    Body: buffer,
    ContentType: mimetype,
    ACL: 'public-read', // or use signed URLs if you want private
  };

  const uploadResult = await s3.upload(params).promise();
  return uploadResult.Location; // This is the public URL
};

const deleteFromS3 = async (url) => {
  const key = url.split('.amazonaws.com/')[1];
  await s3.deleteObject({
    Bucket: process.env.S3_BUCKET_NAME,
    Key: key
  }).promise();
};

module.exports = { uploadToS3, deleteFromS3 };
