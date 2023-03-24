/*
  Warnings:

  - You are about to drop the column `couponsName` on the `CouponsForUser` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_CouponsForUser" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" INTEGER NOT NULL,
    "userEmail" TEXT NOT NULL DEFAULT '',
    "couponId" INTEGER NOT NULL,
    "used" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "CouponsForUser_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "CouponsForUser_couponId_fkey" FOREIGN KEY ("couponId") REFERENCES "Coupon" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_CouponsForUser" ("couponId", "id", "used", "userEmail", "userId") SELECT "couponId", "id", "used", "userEmail", "userId" FROM "CouponsForUser";
DROP TABLE "CouponsForUser";
ALTER TABLE "new_CouponsForUser" RENAME TO "CouponsForUser";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
