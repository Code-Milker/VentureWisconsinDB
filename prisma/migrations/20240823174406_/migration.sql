-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_User" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "email" TEXT NOT NULL,
    "firstName" TEXT,
    "lastName" TEXT,
    "password" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'USER',
    "groupsGroupName" TEXT,
    "pendingAccountChange" BOOLEAN NOT NULL DEFAULT false,
    "authId" TEXT NOT NULL DEFAULT 'filler data',
    "authStrategy" TEXT NOT NULL DEFAULT 'usernamePassword'
);
INSERT INTO "new_User" ("authId", "createdAt", "email", "firstName", "groupsGroupName", "id", "lastName", "password", "pendingAccountChange", "role") SELECT "authId", "createdAt", "email", "firstName", "groupsGroupName", "id", "lastName", "password", "pendingAccountChange", "role" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
