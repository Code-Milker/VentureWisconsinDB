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
    "phone" INTEGER NOT NULL,
    "website" TEXT NOT NULL,
    "images" TEXT NOT NULL
);
INSERT INTO "new_Listing" ("address", "attributes", "category", "city", "description", "displayTitle", "email", "id", "images", "name", "phone", "subTitle", "website", "zipcode") SELECT "address", "attributes", "category", "city", "description", "displayTitle", "email", "id", "images", "name", "phone", "subTitle", "website", "zipcode" FROM "Listing";
DROP TABLE "Listing";
ALTER TABLE "new_Listing" RENAME TO "Listing";
CREATE UNIQUE INDEX "Listing_name_key" ON "Listing"("name");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
