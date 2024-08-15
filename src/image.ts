import AWS from 'aws-sdk';
import multer from 'multer';
import dotenv from 'dotenv';

dotenv.config();

AWS.config.update({
  accessKeyId: 'AKIARWOZAT34JUYNCZWF',   // Replace with your IAM user's access key ID
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY, // Load from environment variable
  region: 'us-east-2' // Replace with your desired region, e.g., 'us-west-2'
});

// Create an S3 instance
const s3 = new AWS.S3();

// Configure multer for file uploads
const upload = multer({ storage: multer.memoryStorage() });

export const S3Routes = {
  uploadImage: async (req: any, res: any) => {
    const uploadedFiles: any = [];
    for (const file of req.files.images) {
      const params = {
        Bucket: 'venture-wisconsin-test', // Replace with your S3 bucket name
        Key: `${req.body.listingId}_${Date.now()}_${file.originalname}`, // Create a unique file name in S3
        Body: file.buffer,
        ContentType: file.mimetype,
      };
      try {
        const data = await s3.upload(params).promise();
        uploadedFiles.push({ filename: file.originalname, location: data.Location });
      } catch (err) {
        console.error('Error uploading file:', file.originalname, err);
        return res.status(500).json({ message: `Error uploading file: ${file.originalname}` });
      }
    }
  },

  fetchImage: async (req: any, res: any) => {
    const { key } = req.params;

    const params = {
      Bucket: 'venture-wisconsin-test', // Replace with your S3 bucket name
      Key: key, // The file name you want to fetch from S3
    };

    try {
      const data = await s3.getObject(params).promise();
      res.writeHead(200, {
        'Content-Type': data.ContentType,
        'Content-Length': data.ContentLength,
      });
      res.end(data.Body);
    } catch (err) {
      console.error('Error fetching file:', err);
      res.status(500).send('Error fetching file');
    }
  },

  upload,
};
