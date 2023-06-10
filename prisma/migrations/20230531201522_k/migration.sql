/*
  Warnings:

  - You are about to drop the column `userId` on the `CouponsForUser` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_CouponsForUser" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userEmail" TEXT NOT NULL DEFAULT '',
    "couponId" INTEGER NOT NULL,
    "used" BOOLEAN NOT NULL DEFAULT false
);
INSERT INTO "new_CouponsForUser" ("couponId", "id", "used", "userEmail") SELECT "couponId", "id", "used", "userEmail" FROM "CouponsForUser";
DROP TABLE "CouponsForUser";
ALTER TABLE "new_CouponsForUser" RENAME TO "CouponsForUser";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
