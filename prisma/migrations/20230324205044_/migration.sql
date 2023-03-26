/*
  Warnings:

  - You are about to drop the column `group` on the `Coupon` table. All the data in the column will be lost.

*/
-- CreateTable
CREATE TABLE "Groups" (
    "groupName" TEXT NOT NULL PRIMARY KEY
);

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Coupon" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "listingId" INTEGER,
    "description" TEXT NOT NULL,
    "expired" BOOLEAN NOT NULL DEFAULT false,
    "email" TEXT NOT NULL,
    "groupName" TEXT,
    CONSTRAINT "Coupon_listingId_fkey" FOREIGN KEY ("listingId") REFERENCES "Listing" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Coupon_groupName_fkey" FOREIGN KEY ("groupName") REFERENCES "Groups" ("groupName") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Coupon" ("description", "email", "expired", "id", "listingId", "name") SELECT "description", "email", "expired", "id", "listingId", "name" FROM "Coupon";
DROP TABLE "Coupon";
ALTER TABLE "new_Coupon" RENAME TO "Coupon";
CREATE UNIQUE INDEX "Coupon_name_key" ON "Coupon"("name");
CREATE TABLE "new_User" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "email" TEXT NOT NULL,
    "firstName" TEXT,
    "lastName" TEXT,
    "password" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'USER',
    "groupsGroupName" TEXT,
    CONSTRAINT "User_groupsGroupName_fkey" FOREIGN KEY ("groupsGroupName") REFERENCES "Groups" ("groupName") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_User" ("createdAt", "email", "firstName", "id", "lastName", "password", "role") SELECT "createdAt", "email", "firstName", "id", "lastName", "password", "role" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
