-- CreateTable
CREATE TABLE "Data" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "price" DOUBLE PRECISION NOT NULL,
    "category" TEXT NOT NULL,
    "image" TEXT,
    "sold" BOOLEAN NOT NULL,
    "dateOfSale" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Data_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Data_dateOfSale_idx" ON "Data"("dateOfSale");

-- CreateIndex
CREATE INDEX "Data_category_idx" ON "Data"("category");
