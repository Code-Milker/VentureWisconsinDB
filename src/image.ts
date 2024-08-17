import AWS from 'aws-sdk';
import multer from 'multer';
import dotenv from 'dotenv';
import { Prisma, PrismaClient } from '@prisma/client';
import { DefaultArgs } from '@prisma/client/runtime/library';

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
  uploadImage: async (images: any, listingId: string, res: any, prisma: PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>,) => {
    const uploadedFiles: any = [];
    let index = 1
    await prisma.listing.update({ where: { id: Number(listingId) }, data: { image1: null, image2: null, image3: null, image4: null, } })
    if (!images) {
      return;
    }
    for (const file of images) {
      const params = {
        Bucket: 'venture-wisconsin-test', // Replace with your S3 bucket name
        Key: file.originalname, // Create a unique file name in S3
        Body: file.buffer,
        ContentType: file.mimetype,
      };
      try {
        const data = await s3.upload(params).promise();
        console.log(`image${index}`)
        await prisma.listing.update({ where: { id: Number(listingId) }, data: { [`image${index}`]: file.originalname } })
        uploadedFiles.push({ filename: file.originalname, location: data.Location });
        index++;
      } catch (err) {
        console.error('Error uploading file:', file.originalname, err);
        return res.status(500).json({ message: `Error uploading file: ${file.originalname}` });
      }
    }

  },

  // fetchImage: async (req: any, res: any) => {
  //   const { key } = req.params;
  //
  //   const params = {
  //     Bucket: 'venture-wisconsin-test', // Replace with your S3 bucket name
  //     Key: key, // The file name you want to fetch from S3
  //   };
  //
  //   try {
  //     const data = await s3.getObject(params).promise();
  //     res.writeHead(200, {
  //       'Content-Type': data.ContentType,
  //       'Content-Length': data.ContentLength,
  //     });
  //     res.end(data.Body);
  //   } catch (err) {
  //     console.error('Error fetching file:', err);
  //     res.status(500).send('Error fetching file');
  //   }
  // },

  // fetchImages: async (req: any, res: any) => {
  //   console.log('body:', req.body)
  //   if (!req.body) {
  //     return res.status(200).json([]); // 
  //
  //   }
  //   const { imageKeys } = req.body; // Expect an array of keys in the request body
  //
  //   if (!Array.isArray(imageKeys) || imageKeys.length === 0) {
  //     return res.status(400).send('No keys provided');
  //   }
  //
  //   try {
  //     const images = await Promise.all(imageKeys.map(async (key) => {
  //       const params = {
  //         Bucket: 'venture-wisconsin-test', // Replace with your S3 bucket name
  //         Key: key, // The file name you want to fetch from S3
  //       };
  //       const data = await s3.getObject(params).promise();
  //       return {
  //         key,
  //         contentType: data.ContentType,
  //         contentLength: data.ContentLength,
  //         // @ts-ignore
  //         body: data.Body.toString('base64'), // Convert the buffer to base64
  //       };
  //     }));
  //
  //     res.status(200).json(images); // Send all images as a JSON array
  //   } catch (err) {
  //     console.error('Error fetching files:', err);
  //     res.status(500).send('Error fetching files');
  //   }
  // },

  upload,
};
