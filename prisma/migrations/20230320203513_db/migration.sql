/*
  Warnings:

  - Added the required column `email` to the `Coupon` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Coupon" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "listingId" INTEGER,
    "description" TEXT NOT NULL,
    "expired" BOOLEAN NOT NULL DEFAULT false,
    "email" TEXT NOT NULL,
    CONSTRAINT "Coupon_listingId_fkey" FOREIGN KEY ("listingId") REFERENCES "Listing" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Coupon" ("description", "expired", "id", "listingId", "name") SELECT "description", "expired", "id", "listingId", "name" FROM "Coupon";
DROP TABLE "Coupon";
ALTER TABLE "new_Coupon" RENAME TO "Coupon";
CREATE UNIQUE INDEX "Coupon_name_key" ON "Coupon"("name");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
