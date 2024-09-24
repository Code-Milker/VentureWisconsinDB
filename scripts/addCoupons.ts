import { PrismaClient } from "../prisma";
import fs from "fs";
import csv from "csv-parser";

export async function addCouponsFromCSV(prisma: PrismaClient) {
  await prisma.coupon.deleteMany();
  // Path to your CSV file
  const csvFilePath = "./scripts/coupons.csv";

  // Read the CSV file
  const results: any[] = [];
  fs.createReadStream(csvFilePath)
    .pipe(csv())
    .on("data", (data) => results.push(data))
    .on("end", async () => {
      for (const couponData of results) {
        try {
          // Find the listing by name
          const listing = await prisma.listing.findFirst({
            where: {
              name: couponData.listingName,
            },
          });

          // Check if listing exists
          if (!listing) {
            console.log(`Listing not found for: ${couponData.listingName}`);
            continue;
          }

          // Create the coupon
          const coupon = {
            name: couponData.name + `${Math.random() * 10000}`,
            description: couponData.description,
            email: "some@email.com",
            expirationDate: new Date(couponData.expirationDate),
            couponType: couponData.couponType, // Assuming couponType is a string, adjust accordingly
            listingId: listing.id, // Add the listing ID to the coupon
          };

          // Add optional fields based on the coupon type
          if (couponData.couponType === "percent") {
            coupon["percentOff"] = couponData.percentOff;
            coupon["percentOffFor"] = couponData.percentOffFor;
            coupon["itemName"] = couponData.itemName;
          } else if (couponData.couponType === "offers") {
            coupon["amountRequiredToQualify"] =
              couponData.amountRequiredToQualify;
          } else if (couponData.couponType === "dollar") {
            coupon["dollarsOff"] = parseFloat(couponData.dollarsOff);
          }

          // Insert the coupon into the database
          await prisma.coupon.create({
            data: coupon,
          });
        } catch (error) {
          console.error(
            `Error adding coupon for listing: ${couponData.listingName}`,
            error,
          );
        }
      }

      console.log("Finished processing CSV.");
      await prisma.$disconnect();
    });
}
