-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Groups" (
    "groupName" TEXT NOT NULL PRIMARY KEY,
    "activationCode" TEXT NOT NULL,
    "description" TEXT NOT NULL
);
INSERT INTO "new_Groups" ("activationCode", "description", "groupName") SELECT "activationCode", "description", "groupName" FROM "Groups";
DROP TABLE "Groups";
ALTER TABLE "new_Groups" RENAME TO "Groups";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
