import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import multer from 'multer';
import dotenv from 'dotenv';
import { Prisma, PrismaClient } from '../prisma';
import { DefaultArgs } from '../prisma/runtime/library';
import sharp from 'sharp';

dotenv.config();

// Initialize the S3 client
const s3 = new S3Client({
  region: 'us-east-2', // Replace with your desired region, e.g., 'us-west-2'
  credentials: {
    accessKeyId: 'AKIARWOZAT34JUYNCZWF', // Replace with your IAM user's access key ID
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY as string, // Load from environment variable
  },
});

// Configure multer for file uploads
const upload = multer({ storage: multer.memoryStorage() });

export const S3Routes = {
  uploadImages: async (
    images: any,
    listingId: string,
    res: any,
    prisma: PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>,
  ) => {
    // const uploadedFiles: any = [];
    let index = 1;
    await prisma.listing.update({
      where: { id: Number(listingId) },
      data: { image1: null, image2: null, image3: null, image4: null },
    });

    if (!images) {
      return;
    }

    for (const file of images) {
      const processedImageBuffer = await sharp(file.buffer)
        .resize(1080, 720) // Resize to 1080x720 pixels
        .jpeg({ quality: 80 }) // Compress the image with 80% quality
        .toBuffer();

      const params = {
        Bucket: 'venture-wisconsin-test', // Replace with your S3 bucket name
        Key: file.originalname, // Create a unique file name in S3
        Body: processedImageBuffer,
        ContentType: file.mimetype,
      };

      try {
        const command = new PutObjectCommand(params);
        const data = await s3.send(command);
        console.log(`image${index}`);
        await prisma.listing.update({
          where: { id: Number(listingId) },
          data: { [`image${index}`]: file.originalname },
        });
        // uploadedFiles.push({ filename: file.originalname, location: data.Location });
        index++;
      } catch (err) {
        console.error('Error uploading file:', file.originalname, err);
        return res.status(500).json({ message: `Error uploading file: ${file.originalname}` });
      }
    }
  },

  // Add the commented-out routes (fetchImage, fetchImages) if needed, ensuring to convert them to use AWS SDK v3 as well.

  upload,
};
