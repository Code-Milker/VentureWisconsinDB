/*
  Warnings:

  - You are about to drop the column `expires` on the `Coupon` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Coupon" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "listingId" INTEGER,
    "description" TEXT NOT NULL,
    "expired" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "Coupon_listingId_fkey" FOREIGN KEY ("listingId") REFERENCES "Listing" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Coupon" ("description", "id", "listingId", "name") SELECT "description", "id", "listingId", "name" FROM "Coupon";
DROP TABLE "Coupon";
ALTER TABLE "new_Coupon" RENAME TO "Coupon";
CREATE UNIQUE INDEX "Coupon_name_key" ON "Coupon"("name");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
