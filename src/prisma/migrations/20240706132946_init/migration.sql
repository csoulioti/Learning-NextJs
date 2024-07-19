-- CreateTable
CREATE TABLE "ZenstackAuth" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "clerkId" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Project" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "deleted" BOOLEAN DEFAULT false,
    "title" TEXT NOT NULL DEFAULT '',
    "subhead" TEXT NOT NULL DEFAULT '',
    "description" TEXT NOT NULL DEFAULT ''
);

-- CreateIndex
CREATE INDEX "Project_id_updatedAt_idx" ON "Project"("id", "updatedAt");
