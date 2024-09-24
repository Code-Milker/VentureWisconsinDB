import { PrismaClient } from "../prisma";
import request from "supertest";
import app from "../src/indexSetup";
import { generateData, deleteAllData } from "../scripts/generateData";
import { USER } from "../scripts/data";
const prisma = new PrismaClient();
describe("POST /trpc/couponUse", () => {
  beforeEach(async () => {
    // Clean up the database before tests
    await deleteAllData(prisma);
    await generateData(prisma);
  });

  afterAll(async () => {
    // Disconnect Prisma client after all tests are done
    await prisma.$disconnect();
  });

  it("should successfully redeem a valid non listing coupon ", async () => {
    const user = await prisma.user.findFirst({ where: { email: USER.email } });
    expect(user).toBeDefined();
    const group = await prisma.groups.findFirst({
      where: { groupName: "update with group name TODO" },
    });
    const listing = await prisma.listing.findFirst();
    expect(listing).toBeDefined();
    const coupon = await prisma.coupon.create({
      data: {
        description: "Test coupon",
        percentOff: "10%",
        percentOffFor: "offBill",
        email: user?.email as string,
        name: "group coupon",
        couponType: "% off",
        listingId: listing?.id as number,
        expirationDate: "2024-08-25T21:18:51.244Z",
        groupName: "update with group name TODO", // Use d pub
      },
    });

    const couponForUser = await prisma.couponsForUser.create({
      data: { couponId: coupon.id, userEmail: user!.email },
    });

    const response = await request(app).post("/trpc/couponUse").send({
      email: user?.email,
      couponId: coupon.id.toString(), // Pass couponId as a string
      passcode: listing!.code,
    });
    // console.log(response.body.data)
    expect(response.status).toBe(200);
    expect(response.body.result.data).toHaveProperty("id");
    expect(response.body.result.data.used).toBe(true);
    expect(response.body.result.data.userEmail).toBe(user?.email);
  });

  it("should return 400 if the groupName does not correspond to a valid listing", async () => {
    const user = await prisma.user.findFirst({ where: { email: USER.email } });
    expect(user).toBeDefined();
    const listing = await prisma.listing.findFirst();
    expect(listing).toBeDefined();
    // Create a coupon with a groupName that does not correspond to any listing
    const coupon = await prisma.coupon.create({
      data: {
        description: "Invalid group coupon",
        percentOff: "10%",
        percentOffFor: "offBill",
        email: user?.email as string,
        name: "Invalid group coupon",
        couponType: "% off",
        listingId: listing!.id, // No listing ID
        expirationDate: "2024-08-25T21:18:51.244Z",
        groupName: "Non-existent Group", // Invalid groupName
      },
    });

    const response = await request(app)
      .post("/trpc/couponUse")
      .send({
        email: user?.email,
        couponId: coupon.id + "", // Pass couponId as a string
        passcode: listing!.code, // Assuming this passcode is irrelevant here
      });

    expect(response.status).toBe(400);
    expect(response.body.error.data.code).toBe("BAD_REQUEST");
    expect(response.body.error.message).toBe(
      "This coupon is not valid for the associated listing.",
    );
  });

  it("should return 404 if the groupName corresponds to a deleted listing", async () => {
    const user = await prisma.user.findFirst({ where: { email: USER.email } });
    expect(user).toBeDefined();
    const listing = await prisma.listing.findFirst();
    expect(listing).toBeDefined();

    // Create a listing and then delete it

    // Delete the listing
    // await prisma.listing.delete({
    //   where: { id: listing.id },
    // });

    // Create a coupon with a groupName that corresponds to the deleted listing
    const coupon = await prisma.coupon.create({
      data: {
        description: "Deleted listing group coupon",
        percentOff: "10%",
        percentOffFor: "offBill",
        email: user?.email as string,
        name: "Deleted listing coupon",
        couponType: "% off",
        listingId: listing!.id, // Corresponds to the deleted listing
        expirationDate: "2024-08-25T21:18:51.244Z",
        groupName: listing!.name, // Group corresponding to the deleted listing
      },
    });

    await prisma.listing.delete({
      where: { id: listing!.id },
    });

    const response = await request(app).post("/trpc/couponUse").send({
      email: user?.email,
      couponId: coupon.id.toString(), // Pass couponId as a string
      passcode: listing!.code, // This passcode should now be invalid
    });

    expect(response.status).toBe(404);
    expect(response.body.error.data.code).toBe("NOT_FOUND");
    expect(response.body.error.message).toBe(
      "Listing not found for this coupon.",
    );
  });

  // it("should successfully redeem a coupon with a valid groupName that is not a listing", async () => {
  //   const user = await prisma.user.findFirst({ where: { email: USER.email } });
  //   expect(user).toBeDefined();
  //   const listing = await prisma.listing.findFirst();
  //   expect(listing).toBeDefined();
  //   console.log(listing!.id);
  //
  //   // Create a group that does not correspond to any listing
  //   const group = await prisma.groups.create({
  //     data: {
  //       groupName: "Non-listing Group",
  //     },
  //   });
  //
  //   // Create a coupon with a groupName that corresponds to the non-listing group
  //   const coupon = await prisma.coupon.create({
  //     data: {
  //       description: "Non-listing group coupon",
  //       percentOff: "15%",
  //       percentOffFor: "offBill",
  //       email: user?.email as string,
  //       name: "Non-listing group coupon",
  //       couponType: "% off",
  //       listingId: listing!.id, // No listing ID
  //       expirationDate: "2024-08-25T21:18:51.244Z",
  //       groupName: group.groupName, // Valid groupName but not a listing
  //     },
  //   });
  //
  //   const couponForUser = await prisma.couponsForUser.create({
  //     data: { couponId: coupon.id, userEmail: user!.email },
  //   });
  //   const response = await request(app).post("/trpc/couponUse").send({
  //     email: user?.email,
  //     couponId: coupon.id.toString(), // Pass couponId as a string
  //     passcode: listing!.code, // Assuming this is the correct passcode for the group
  //   });
  //
  //   expect(response.status).toBe(200);
  //   expect(response.body.result.data).toHaveProperty("id");
  //   expect(response.body.result.data.used).toBe(true);
  //   expect(response.body.result.data.userEmail).toBe(user?.email);
  // });
});
