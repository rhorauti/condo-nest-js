-- CreateEnum
CREATE TYPE "AddressType" AS ENUM ('HOUSE', 'APARTMENT');

-- CreateEnum
CREATE TYPE "PostType" AS ENUM ('QUESTION_FEEDBACK', 'BULLETIN_BOARD', 'COMPLAINS', 'INDICATION', 'OTHERS');

-- CreateTable
CREATE TABLE "Condo" (
    "idCondo" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "PK_condo" PRIMARY KEY ("idCondo")
);

-- CreateTable
CREATE TABLE "User" (
    "idUser" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "birthDate" TIMESTAMPTZ,
    "photoPath" TEXT,
    "phone" TEXT,
    "agreedWithTerms" BOOLEAN NOT NULL DEFAULT false,
    "isActive" BOOLEAN NOT NULL DEFAULT false,
    "accessLevel" INTEGER NOT NULL DEFAULT 1,
    "isEmailConfirmed" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "idCondo" INTEGER,

    CONSTRAINT "PK_user" PRIMARY KEY ("idUser")
);

-- CreateTable
CREATE TABLE "Address" (
    "idAddress" SERIAL NOT NULL,
    "type" "AddressType" NOT NULL DEFAULT 'HOUSE',
    "street" TEXT NOT NULL,
    "number" TEXT,
    "city" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "zipCode" TEXT NOT NULL,
    "block" TEXT,
    "blockType" INTEGER,
    "lot" TEXT,
    "lotType" INTEGER,
    "apartament" TEXT,
    "idUser" INTEGER NOT NULL,
    "idCondo" INTEGER NOT NULL,

    CONSTRAINT "PK_address" PRIMARY KEY ("idAddress")
);

-- CreateTable
CREATE TABLE "Post" (
    "idPost" SERIAL NOT NULL,
    "type" "PostType" NOT NULL,
    "description" TEXT NOT NULL,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "idUser" INTEGER NOT NULL,

    CONSTRAINT "PK_post" PRIMARY KEY ("idPost")
);

-- CreateTable
CREATE TABLE "Comment" (
    "idComment" SERIAL NOT NULL,
    "description" TEXT NOT NULL,
    "mediaList" TEXT[],
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "idUser" INTEGER NOT NULL,
    "idPost" INTEGER NOT NULL,
    "idParent" INTEGER,

    CONSTRAINT "PK_comment" PRIMARY KEY ("idComment")
);

-- CreateTable
CREATE TABLE "PostLike" (
    "idPostLike" SERIAL NOT NULL,
    "idUser" INTEGER NOT NULL,
    "idPost" INTEGER NOT NULL,

    CONSTRAINT "PostLike_pkey" PRIMARY KEY ("idPostLike")
);

-- CreateTable
CREATE TABLE "CommentLike" (
    "idCommentLike" SERIAL NOT NULL,
    "idUser" INTEGER NOT NULL,
    "idComment" INTEGER NOT NULL,

    CONSTRAINT "CommentLike_pkey" PRIMARY KEY ("idCommentLike")
);

-- CreateTable
CREATE TABLE "PostMedia" (
    "idPostMedia" SERIAL NOT NULL,
    "idPost" INTEGER NOT NULL,
    "idComment" INTEGER NOT NULL,
    "mediaPath" TEXT NOT NULL,
    "size" INTEGER,
    "format" TEXT,

    CONSTRAINT "PostMedia_pkey" PRIMARY KEY ("idPostMedia")
);

-- CreateIndex
CREATE UNIQUE INDEX "UQ_condo_name" ON "Condo"("name");

-- CreateIndex
CREATE UNIQUE INDEX "UQ_user_email" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Address_idCondo_key" ON "Address"("idCondo");

-- CreateIndex
CREATE INDEX "Post_idUser_idx" ON "Post"("idUser");

-- CreateIndex
CREATE INDEX "Post_createdAt_idx" ON "Post"("createdAt");

-- CreateIndex
CREATE INDEX "Comment_idPost_idx" ON "Comment"("idPost");

-- CreateIndex
CREATE INDEX "Comment_idUser_idx" ON "Comment"("idUser");

-- CreateIndex
CREATE INDEX "Comment_createdAt_idx" ON "Comment"("createdAt");

-- CreateIndex
CREATE INDEX "PostLike_idPost_idx" ON "PostLike"("idPost");

-- CreateIndex
CREATE UNIQUE INDEX "PostLike_idUser_idPost_key" ON "PostLike"("idUser", "idPost");

-- CreateIndex
CREATE INDEX "CommentLike_idComment_idx" ON "CommentLike"("idComment");

-- CreateIndex
CREATE UNIQUE INDEX "CommentLike_idUser_idComment_key" ON "CommentLike"("idUser", "idComment");

-- CreateIndex
CREATE INDEX "PostMedia_idPost_idComment_idx" ON "PostMedia"("idPost", "idComment");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_idCondo_fkey" FOREIGN KEY ("idCondo") REFERENCES "Condo"("idCondo") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Address" ADD CONSTRAINT "Address_idUser_fkey" FOREIGN KEY ("idUser") REFERENCES "User"("idUser") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Address" ADD CONSTRAINT "Address_idCondo_fkey" FOREIGN KEY ("idCondo") REFERENCES "Condo"("idCondo") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Post" ADD CONSTRAINT "Post_idUser_fkey" FOREIGN KEY ("idUser") REFERENCES "User"("idUser") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_idUser_fkey" FOREIGN KEY ("idUser") REFERENCES "User"("idUser") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_idPost_fkey" FOREIGN KEY ("idPost") REFERENCES "Post"("idPost") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_idParent_fkey" FOREIGN KEY ("idParent") REFERENCES "Comment"("idComment") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PostLike" ADD CONSTRAINT "PostLike_idUser_fkey" FOREIGN KEY ("idUser") REFERENCES "User"("idUser") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PostLike" ADD CONSTRAINT "PostLike_idPost_fkey" FOREIGN KEY ("idPost") REFERENCES "Post"("idPost") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CommentLike" ADD CONSTRAINT "CommentLike_idUser_fkey" FOREIGN KEY ("idUser") REFERENCES "User"("idUser") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CommentLike" ADD CONSTRAINT "CommentLike_idComment_fkey" FOREIGN KEY ("idComment") REFERENCES "Comment"("idComment") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PostMedia" ADD CONSTRAINT "PostMedia_idPost_fkey" FOREIGN KEY ("idPost") REFERENCES "Post"("idPost") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PostMedia" ADD CONSTRAINT "PostMedia_idComment_fkey" FOREIGN KEY ("idComment") REFERENCES "Comment"("idComment") ON DELETE CASCADE ON UPDATE CASCADE;
