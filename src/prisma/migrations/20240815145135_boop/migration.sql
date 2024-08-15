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
    "experience1" TEXT,
    "experience2" TEXT,
    "experience3" TEXT,
    "experience4" TEXT,
    "description" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "website" TEXT NOT NULL,
    "image1" TEXT,
    "image2" TEXT,
    "image3" TEXT,
    "image4" TEXT
);
INSERT INTO "new_Listing" ("address", "category", "city", "description", "displayTitle", "email", "experience1", "experience2", "experience3", "experience4", "id", "image1", "image2", "image3", "image4", "name", "phone", "subTitle", "website", "zipcode") SELECT "address", "category", "city", "description", "displayTitle", "email", "experience1", "experience2", "experience3", "experience4", "id", "image1", "image2", "image3", "image4", "name", "phone", "subTitle", "website", "zipcode" FROM "Listing";
DROP TABLE "Listing";
ALTER TABLE "new_Listing" RENAME TO "Listing";
CREATE UNIQUE INDEX "Listing_name_key" ON "Listing"("name");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
