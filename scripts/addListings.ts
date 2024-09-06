
import { PrismaClient } from "../prisma";
import { parse } from "csv-parse/sync";
import * as fs from 'fs';
import { deleteAllData } from "./insertData";

const prisma = new PrismaClient();

// Function to parse CSV data
const parseCSV = (filePath: string) => {
  const fileContent = fs.readFileSync(filePath, { encoding: 'utf-8' });
  return parse(fileContent, {
    columns: true,
    skip_empty_lines: true,
  });
};

// Function to add listings to the database
const addListings = async (listings: any[]) => {
  try {
    for (const listing of listings) {
      await prisma.listing.create({
        data: {
          name: listing.name,
          address: listing.address,
          city: listing.city,
          zipcode: listing.zipcode,
          displayTitle: listing.displayTitle,
          subTitle: listing.subTitle || null,
          category: listing.category || null,
          experience1: listing.experience1 || null,
          experience2: listing.experience2 || null,
          experience3: listing.experience3 || null,
          experience4: listing.experience4 || null,
          description: listing.description,
          email: listing.email,
          phone: listing.phone,
          website: listing.website,
          image1: listing.image1 || null,
          image2: listing.image2 || null,
          image3: listing.image3 || null,
          image4: listing.image4 || null,
          code: generateRandomCode(), // Assuming you want to generate a unique code for each listing
        },
      });
    }
    console.log('All listings have been added.');
  } catch (e) {
    console.error('Error adding listings:', e);
  } finally {
    await prisma.$disconnect();
  }
};

// Helper function to generate a random code
const generateRandomCode = () => {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
};

// Main function to run the script
(async () => {
  deleteAllData(prisma)
  const filePath = './scripts/listings.csv'; // Update this path as needed
  const listings = parseCSV(filePath);
  await addListings(listings);
})();
