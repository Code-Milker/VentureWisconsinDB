-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_CouponsForUser" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userEmail" TEXT NOT NULL,
    "couponId" INTEGER NOT NULL,
    "used" BOOLEAN NOT NULL DEFAULT false
);
INSERT INTO "new_CouponsForUser" ("couponId", "id", "used", "userEmail") SELECT "couponId", "id", "used", "userEmail" FROM "CouponsForUser";
DROP TABLE "CouponsForUser";
ALTER TABLE "new_CouponsForUser" RENAME TO "CouponsForUser";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
