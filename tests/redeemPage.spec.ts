import request from "supertest";
import { PrismaClient } from "../prisma";
import { deleteAllData, generateData } from "../scripts/generateData";
import app from "../src/indexSetup"; // Assuming your Express app is exported from a file named app.ts

const PORT = 80;
const prisma = new PrismaClient();
describe("POST /api/v1/users", () => {
  beforeAll(async () => {
    // Clean up the database before tests
    await deleteAllData(prisma);
    await generateData(prisma);
  });

  afterAll(async () => {
    // Disconnect Prisma client after all tests are done
    await prisma.$disconnect();
  });
  async function findCouponWithMatchingGroupName() {
    // Step 1: Get all listing names
    const listingNames = await prisma.listing
      .findMany({
        select: {
          name: true,
        },
      })
      .then((listings) => listings.map((listing) => listing.name));

    // Step 2: Find a coupon with a groupName matching one of the listing names
    const coupon = await prisma.coupon.findFirst({
      where: {
        groupName: {
          in: listingNames,
        },
      },
    });

    return coupon;
  }

  describe("GET /redeem", () => {
    it("should return HTML and log it", async () => {
      const coupon = await findCouponWithMatchingGroupName();
      const user = await prisma.user.findFirst();
      const response = await request(app)
        .get("/redeem")
        .query({ couponId: coupon?.id, email: user?.email });

      //
      // // Check that the status code is 200
      expect(response.status).toBe(200);
      //
      // // Check that the Content-Type header is 'text/html'
      expect(response.headers["content-type"]).toMatch(/html/);
      //
      // // Log the HTML response
      //
      // // Optionally, you can add additional assertions to verify specific content in the HTML
      expect(response.text).toContain("<html"); // Example check to ensure it starts with an HTML tag
    });
    it("should return 404 if the coupon does not exist", async () => {
      // Fetch the highest existing coupon ID
      const maxCoupon = await prisma.coupon.findFirst({
        orderBy: {
          id: "desc",
        },
        select: {
          id: true,
        },
      });

      const nonExistentCouponId = (maxCoupon?.id ?? 0) + 1;

      const response = await request(app)
        .get("/redeem")
        .query({ couponId: nonExistentCouponId, email: "test@example.com" });

      expect(response.status).toBe(404);
      expect(response.text).toBe("Coupon not found");
    });

    it("should return 404 if the listing associated with the coupon does not exist", async () => {
      // Fetch the highest existing listing ID
      const maxListing = await prisma.listing.findFirst({
        orderBy: {
          id: "desc",
        },
        select: {
          id: true,
        },
      });

      const nonExistentListingId = (maxListing?.id ?? 0) + 1;

      // Create a coupon with a non-existent listing ID
      const coupon = await prisma.coupon.create({
        data: {
          description: "another discount bill",
          percentOff: "20%",
          percentOffFor: "offBill",
          email: "tylerf66@gmail.com",
          name: "pee",
          couponType: "% off",
          listingId: nonExistentListingId as unknown as number,
          expirationDate: "2024-08-25T21:18:51.244Z",
          groupName: "Venture 2023",
        },
      });
      //
      const response = await request(app)
        .get("/redeem")
        .query({ couponId: coupon.id, email: "test@example.com" });

      expect(response.status).toBe(404);
      expect(response.text).toBe("Listing not found");
    });

    it("should return 404 if the user does not exist", async () => {
      // Assuming a valid couponId exists
      const coupon = await prisma.coupon.findFirst();

      const response = await request(app)
        .get("/redeem")
        .query({ couponId: coupon?.id, email: "nonexistentuser@example.com" });
      expect(response.status).toBe(404);
      expect(response.text).toBe("User not found");
    });
  });
});
