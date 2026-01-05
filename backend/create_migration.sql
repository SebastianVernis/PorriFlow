-- CreateTable News
CREATE TABLE IF NOT EXISTS "news" (
    "id" TEXT NOT NULL,
    "ticker" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "summary" TEXT,
    "url" TEXT NOT NULL,
    "source" TEXT NOT NULL,
    "publisher" TEXT,
    "thumbnail" TEXT,
    "type" TEXT NOT NULL DEFAULT 'article',
    "category" TEXT,
    "sentiment" TEXT,
    "publishedAt" TIMESTAMP(3) NOT NULL,
    "fetchedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "news_pkey" PRIMARY KEY ("id")
);

-- CreateTable UserNewsPreference
CREATE TABLE IF NOT EXISTS "user_news_preferences" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "enablePush" BOOLEAN NOT NULL DEFAULT true,
    "minSentiment" TEXT,
    "categories" TEXT[],
    "tickers" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_news_preferences_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX IF NOT EXISTS "news_url_key" ON "news"("url");
CREATE INDEX IF NOT EXISTS "news_ticker_idx" ON "news"("ticker");
CREATE INDEX IF NOT EXISTS "news_publishedAt_idx" ON "news"("publishedAt");
CREATE INDEX IF NOT EXISTS "news_type_idx" ON "news"("type");
CREATE INDEX IF NOT EXISTS "news_category_idx" ON "news"("category");

-- CreateIndex
CREATE UNIQUE INDEX IF NOT EXISTS "user_news_preferences_userId_key" ON "user_news_preferences"("userId");

-- AddForeignKey
ALTER TABLE "user_news_preferences" ADD CONSTRAINT "user_news_preferences_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
