/*
  Warnings:

  - You are about to drop the `CouponsUsedByUser` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `attributes` to the `Listing` table without a default value. This is not possible if the table is not empty.
  - Added the required column `city` to the `Listing` table without a default value. This is not possible if the table is not empty.
  - Added the required column `displayTitle` to the `Listing` table without a default value. This is not possible if the table is not empty.
  - Added the required column `images` to the `Listing` table without a default value. This is not possible if the table is not empty.
  - Added the required column `zipcode` to the `Listing` table without a default value. This is not possible if the table is not empty.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "CouponsUsedByUser";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "CouponsForUser" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" INTEGER,
    "couponsName" TEXT,
    "used" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "CouponsForUser_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "CouponsForUser_couponsName_fkey" FOREIGN KEY ("couponsName") REFERENCES "Coupon" ("name") ON DELETE SET NULL ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Listing" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "zipcode" TEXT NOT NULL,
    "displayTitle" TEXT NOT NULL,
    "subTitle" TEXT,
    "category" TEXT,
    "attributes" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "website" TEXT NOT NULL,
    "images" TEXT NOT NULL
);
INSERT INTO "new_Listing" ("address", "category", "description", "email", "id", "name", "phone", "website") SELECT "address", "category", "description", "email", "id", "name", "phone", "website" FROM "Listing";
DROP TABLE "Listing";
ALTER TABLE "new_Listing" RENAME TO "Listing";
CREATE UNIQUE INDEX "Listing_name_key" ON "Listing"("name");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
