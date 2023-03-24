-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_CouponsForUser" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" INTEGER NOT NULL,
    "userEmail" TEXT NOT NULL DEFAULT '',
    "couponId" INTEGER NOT NULL DEFAULT 0,
    "couponsName" TEXT NOT NULL,
    "used" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "CouponsForUser_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "CouponsForUser_couponsName_fkey" FOREIGN KEY ("couponsName") REFERENCES "Coupon" ("name") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_CouponsForUser" ("couponsName", "id", "used", "userEmail", "userId") SELECT "couponsName", "id", "used", "userEmail", "userId" FROM "CouponsForUser";
DROP TABLE "CouponsForUser";
ALTER TABLE "new_CouponsForUser" RENAME TO "CouponsForUser";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
