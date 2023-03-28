-- CreateTable
CREATE TABLE "FollowUser" (
    "id" TEXT NOT NULL,
    "authorId" TEXT NOT NULL,
    "followUserId" TEXT NOT NULL,

    CONSTRAINT "FollowUser_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "FollowUser" ADD CONSTRAINT "FollowUser_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FollowUser" ADD CONSTRAINT "FollowUser_followUserId_fkey" FOREIGN KEY ("followUserId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
