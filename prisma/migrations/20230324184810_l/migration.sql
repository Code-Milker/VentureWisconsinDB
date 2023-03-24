/*
  Warnings:

  - Made the column `couponsName` on table `CouponsForUser` required. This step will fail if there are existing NULL values in that column.
  - Made the column `userId` on table `CouponsForUser` required. This step will fail if there are existing NULL values in that column.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_CouponsForUser" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" INTEGER NOT NULL,
    "userEmail" TEXT NOT NULL DEFAULT '',
    "couponsName" TEXT NOT NULL,
    "used" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "CouponsForUser_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "CouponsForUser_couponsName_fkey" FOREIGN KEY ("couponsName") REFERENCES "Coupon" ("name") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_CouponsForUser" ("couponsName", "id", "used", "userId") SELECT "couponsName", "id", "used", "userId" FROM "CouponsForUser";
DROP TABLE "CouponsForUser";
ALTER TABLE "new_CouponsForUser" RENAME TO "CouponsForUser";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
