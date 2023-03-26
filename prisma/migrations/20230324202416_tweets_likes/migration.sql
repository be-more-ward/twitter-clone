-- CreateTable
CREATE TABLE "TweetLikes" (
    "id" TEXT NOT NULL,
    "authorId" TEXT NOT NULL,
    "tweetId" TEXT NOT NULL,

    CONSTRAINT "TweetLikes_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "TweetLikes" ADD CONSTRAINT "TweetLikes_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TweetLikes" ADD CONSTRAINT "TweetLikes_tweetId_fkey" FOREIGN KEY ("tweetId") REFERENCES "Tweet"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
