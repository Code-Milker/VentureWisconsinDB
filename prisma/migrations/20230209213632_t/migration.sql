/*
  Warnings:

  - You are about to drop the column `images` on the `Listing` table. All the data in the column will be lost.
  - Added the required column `image1` to the `Listing` table without a default value. This is not possible if the table is not empty.
  - Added the required column `image2` to the `Listing` table without a default value. This is not possible if the table is not empty.
  - Added the required column `image3` to the `Listing` table without a default value. This is not possible if the table is not empty.
  - Added the required column `image4` to the `Listing` table without a default value. This is not possible if the table is not empty.

*/
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
    "attributes" TEXT,
    "description" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "website" TEXT NOT NULL,
    "image1" TEXT NOT NULL,
    "image2" TEXT NOT NULL,
    "image3" TEXT NOT NULL,
    "image4" TEXT NOT NULL
);
INSERT INTO "new_Listing" ("address", "attributes", "category", "city", "description", "displayTitle", "email", "id", "name", "phone", "subTitle", "website", "zipcode") SELECT "address", "attributes", "category", "city", "description", "displayTitle", "email", "id", "name", "phone", "subTitle", "website", "zipcode" FROM "Listing";
DROP TABLE "Listing";
ALTER TABLE "new_Listing" RENAME TO "Listing";
CREATE UNIQUE INDEX "Listing_name_key" ON "Listing"("name");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
