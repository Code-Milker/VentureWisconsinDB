import { PrismaClient } from "../prisma";
import request from "supertest";
import app from "../src/indexSetup";
import { createData, deleteAllData } from "../scripts/insertData";

const prisma = new PrismaClient();

describe("POST /trpc/couponUse", () => {
  beforeEach(async () => {
    // Clean up the database before tests
    await deleteAllData(prisma);
    await createData(prisma);
  });

  afterAll(async () => {
    // Disconnect Prisma client after all tests are done
    await prisma.$disconnect();
  });

  it("should return 404 if the user does not exist", async () => {
    const coupon = await prisma.coupon.findFirst({
      where: { groupName: "d pub" },
    });
    const listing = await prisma.listing.findFirst({
      where: { name: "d pub" },
    });

    const response = await request(app)
      .post("/trpc/couponUse")
      .send({
        email: "notexist@gmail.com",
        couponId: coupon?.id + "",
        passcode: listing?.code,
      });

    expect(response.status).toBe(404);

    expect(response.body.error.data.code).toBe("NOT_FOUND");
    expect(response.body.error.message).toBe("User not found.");
  });

  it("should return 400 if the coupon has already been used", async () => {
    const user = await prisma.user.findFirst();
    const coupon = await prisma.coupon.findFirst();

    // First, use the coupon
    await prisma.couponsForUser.create({
      data: {
        couponId: coupon?.id as number,
        userEmail: user?.email as string,
        used: true,
      },
    });

    // Try to use the coupon again
    const response = await request(app)
      .post("/trpc/couponUse")
      .send({
        email: user?.email,
        couponId: coupon?.id + "",
        passcode: "d pub",
      });

    expect(response.status).toBe(400);
    expect(response.body.error.data.code).toBe("BAD_REQUEST");
    expect(response.body.error.message).toBe(
      "This coupon has already been used.",
    );
  });

  it("should return 404 if the coupon does not exist", async () => {
    const user = await prisma.user.findFirst();

    const response = await request(app).post("/trpc/couponUse").send({
      email: user?.email,
      couponId: "99999", // Pass couponId as a string
      passcode: "d pub",
    });

    expect(response.status).toBe(404);
    expect(response.body.error.data.code).toBe("NOT_FOUND");
    expect(response.body.error.message).toBe("Coupon not found.");
  });

  it("should return 404 if the listing associated with the coupon does not exist", async () => {
    const user = await prisma.user.findFirst();

    // Create a coupon with a non-existent listing ID
    const coupon = await prisma.coupon.create({
      data: {
        description: "Test coupon",
        percentOff: "10%",
        percentOffFor: "offBill",
        email: user?.email as string,
        name: "Test Coupon",
        couponType: "% off",
        listingId: 99999, // Non-existent listing ID
        expirationDate: "2024-08-25T21:18:51.244Z",
        groupName: "d pub", // Use d pub
      },
    });

    const response = await request(app).post("/trpc/couponUse").send({
      email: user?.email,
      couponId: coupon.id.toString(), // Pass couponId as a string
      passcode: "d pub",
    });

    expect(response.status).toBe(404);
    expect(response.body.error.data.code).toBe("NOT_FOUND");
    expect(response.body.error.message).toBe(
      "Listing not found for this coupon.",
    );
  });

  it("should return 400 if the coupon is not valid for the associated listing", async () => {
    const user = await prisma.user.findFirst();

    // Create a coupon with a valid listing but incorrect group name
    const listing = await prisma.listing.findFirst();
    const coupon = await prisma.coupon.create({
      data: {
        description: "Test coupon",
        percentOff: "10%",
        percentOffFor: "offBill",
        email: user?.email as string,
        name: "Test Coupon",
        couponType: "% off",
        listingId: listing?.id as number,
        expirationDate: "2024-08-25T21:18:51.244Z",
        groupName: "Invalid Group", // Invalid group name
      },
    });

    const response = await request(app).post("/trpc/couponUse").send({
      email: user?.email,
      couponId: coupon.id.toString(), // Pass couponId as a string
      passcode: "d pub",
    });

    expect(response.status).toBe(400);
    expect(response.body.error.data.code).toBe("BAD_REQUEST");
    expect(response.body.error.message).toBe(
      "This coupon is not valid for the associated listing.",
    );
  });

  it("should successfully redeem a valid coupon", async () => {
    const user = await prisma.user.findFirst();

    // Find a coupon with a matching group name for a listing
    const listing = await prisma.listing.findFirst();
    const coupon = await prisma.coupon.create({
      data: {
        description: "Test coupon",
        percentOff: "10%",
        percentOffFor: "offBill",
        email: user?.email as string,
        name: "Test Coupon",
        couponType: "% off",
        listingId: listing?.id as number,
        expirationDate: "2024-08-25T21:18:51.244Z",
        groupName: "d pub", // Use d pub
      },
    });

    const response = await request(app).post("/trpc/couponUse").send({
      email: user?.email,
      couponId: coupon.id.toString(), // Pass couponId as a string
      passcode: "d pub",
    });
    // console.log(response.body.data)
    console.log(response.body);
    expect(response.status).toBe(200);
    expect(response.body.result.data).toHaveProperty("id");
    expect(response.body.result.data.used).toBe(true);
    expect(response.body.result.data.userEmail).toBe(user?.email);
  });
});
