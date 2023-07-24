-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Groups" (
    "groupName" TEXT NOT NULL PRIMARY KEY,
    "activationCode" TEXT NOT NULL DEFAULT 'NotRequired'
);
INSERT INTO "new_Groups" ("groupName") SELECT "groupName" FROM "Groups";
DROP TABLE "Groups";
ALTER TABLE "new_Groups" RENAME TO "Groups";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
