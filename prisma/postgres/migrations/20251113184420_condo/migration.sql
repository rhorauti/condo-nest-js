-- CreateTable
CREATE TABLE "User" (
    "idUser" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "photoPath" TEXT,
    "agreedWithTerms" BOOLEAN NOT NULL DEFAULT false,
    "isActive" BOOLEAN NOT NULL DEFAULT false,
    "accessLevel" INTEGER NOT NULL DEFAULT 1,
    "isEmailConfirmed" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PK_user" PRIMARY KEY ("idUser")
);

-- CreateIndex
CREATE UNIQUE INDEX "UQ_user_email" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "UQ_user_name" ON "User"("name");
