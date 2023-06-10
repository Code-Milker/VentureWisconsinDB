-- CreateTable
CREATE TABLE "User" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "email" TEXT NOT NULL,
    "firstName" TEXT,
    "lastName" TEXT,
    "password" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'USER',
    "groupsGroupName" TEXT
);

-- CreateTable
CREATE TABLE "PinnedUserListing" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" INTEGER NOT NULL,
    "listingId" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "CouponsForUser" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" INTEGER NOT NULL,
    "userEmail" TEXT NOT NULL DEFAULT '',
    "couponId" INTEGER NOT NULL,
    "used" BOOLEAN NOT NULL DEFAULT false
);

-- CreateTable
CREATE TABLE "Groups" (
    "groupName" TEXT NOT NULL PRIMARY KEY
);

-- CreateTable
CREATE TABLE "Coupon" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "listingId" INTEGER,
    "description" TEXT NOT NULL,
    "expirationDate" DATETIME NOT NULL DEFAULT '2019-10-12 07:20:50.520 +00:00',
    "email" TEXT NOT NULL,
    "groupName" TEXT,
    "dollarsOff" TEXT,
    "amountRequiredToQualify" TEXT,
    "percentOff" TEXT,
    "itemName" TEXT,
    "percentOffFor" TEXT,
    "couponType" TEXT
);

-- CreateTable
CREATE TABLE "Listing" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "zipcode" TEXT NOT NULL,
    "displayTitle" TEXT NOT NULL,
    "subTitle" TEXT,
    "category" TEXT,
    "experience1" TEXT,
    "experience2" TEXT,
    "experience3" TEXT,
    "experience4" TEXT,
    "description" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "website" TEXT NOT NULL,
    "image1" TEXT NOT NULL,
    "image2" TEXT,
    "image3" TEXT,
    "image4" TEXT
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Coupon_name_key" ON "Coupon"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Listing_name_key" ON "Listing"("name");
